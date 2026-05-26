// ============================================================
// oauth.js — Sistema de Autenticación Social NeuroLearn Kids
// Google OAuth 2.0 + Facebook Login SDK
// ============================================================

const NLOAuth = {
  
  // Configuración (en producción estas van en variables de entorno)
  config: {
    google: {
      clientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
      // Para desarrollo local, usa: http://localhost:5500
      redirectUri: window.location.origin,
      scope: 'profile email'
    },
    facebook: {
      appId: 'YOUR_FACEBOOK_APP_ID',
      version: 'v18.0'
    }
  },

  // Estado de carga de SDKs
  sdksLoaded: {
    google: false,
    facebook: false
  },

  // ── Inicializar Google OAuth ─────────────────────────────
  async initGoogle() {
    if (this.sdksLoaded.google) return true;
    
    return new Promise((resolve) => {
      // Cargar el SDK de Google Identity Services
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        // Inicializar Google Identity Services
        if (window.google && window.google.accounts) {
          window.google.accounts.id.initialize({
            client_id: this.config.google.clientId,
            callback: (response) => this._handleGoogleResponse(response),
            auto_select: false,
            cancel_on_tap_outside: true
          });
          
          this.sdksLoaded.google = true;
          console.log('✅ Google OAuth SDK cargado');
          resolve(true);
        } else {
          console.error('❌ Error cargando Google SDK');
          resolve(false);
        }
      };
      
      script.onerror = () => {
        console.error('❌ Error cargando script de Google');
        resolve(false);
      };
      
      document.head.appendChild(script);
    });
  },

  // ── Inicializar Facebook SDK ─────────────────────────────
  async initFacebook() {
    if (this.sdksLoaded.facebook) return true;
    
    return new Promise((resolve) => {
      // Crear elemento fbAsyncInit
      window.fbAsyncInit = () => {
        FB.init({
          appId: this.config.facebook.appId,
          cookie: true,
          xfbml: true,
          version: this.config.facebook.version
        });
        
        this.sdksLoaded.facebook = true;
        console.log('✅ Facebook SDK cargado');
        resolve(true);
      };

      // Cargar SDK de Facebook
      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/es_LA/sdk.js';
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      
      script.onerror = () => {
        console.error('❌ Error cargando Facebook SDK');
        resolve(false);
      };
      
      document.body.appendChild(script);
    });
  },

  // ── Login con Google ─────────────────────────────────────
  async loginWithGoogle() {
    const loaded = await this.initGoogle();
    if (!loaded) {
      this._showError('No se pudo conectar con Google. Intenta de nuevo.');
      return;
    }

    // Mostrar modal de autenticación de Google
    try {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Fallback: usar popup en vez de One Tap
          this._showGooglePopup();
        }
      });
    } catch (error) {
      console.error('Error al mostrar Google prompt:', error);
      this._showGooglePopup();
    }
  },

  _showGooglePopup() {
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', this.config.google.clientId);
    authUrl.searchParams.set('redirect_uri', this.config.google.redirectUri);
    authUrl.searchParams.set('response_type', 'token');
    authUrl.searchParams.set('scope', this.config.google.scope);
    authUrl.searchParams.set('include_granted_scopes', 'true');
    authUrl.searchParams.set('state', 'google_oauth');

    // Abrir popup centrado
    const width = 500, height = 600;
    const left = (screen.width / 2) - (width / 2);
    const top = (screen.height / 2) - (height / 2);
    
    window.open(
      authUrl.toString(),
      'Google Login',
      `width=${width},height=${height},left=${left},top=${top},toolbar=0,menubar=0,location=0`
    );
  },

  _handleGoogleResponse(response) {
    if (!response.credential) {
      this._showError('No se pudo obtener credenciales de Google');
      return;
    }

    // Decodificar JWT (el token viene en formato JWT)
    try {
      const payload = this._decodeJWT(response.credential);
      
      // Extraer información del usuario
      const userData = {
        provider: 'google',
        id: payload.sub,
        email: payload.email,
        name: payload.given_name || payload.name.split(' ')[0],
        lastName: payload.family_name || payload.name.split(' ').slice(1).join(' '),
        avatar: payload.picture,
        emailVerified: payload.email_verified
      };

      this._completeOAuthLogin(userData);
    } catch (error) {
      console.error('Error procesando respuesta de Google:', error);
      this._showError('Error al procesar información de Google');
    }
  },

  // ── Login con Facebook ───────────────────────────────────
  async loginWithFacebook() {
    const loaded = await this.initFacebook();
    if (!loaded) {
      this._showError('No se pudo conectar con Facebook. Intenta de nuevo.');
      return;
    }

    FB.login((response) => {
      if (response.authResponse) {
        // Usuario autenticado, obtener información del perfil
        FB.api('/me', { fields: 'id,name,email,picture' }, (userData) => {
          if (userData && !userData.error) {
            const [firstName, ...lastNameParts] = userData.name.split(' ');
            
            const authData = {
              provider: 'facebook',
              id: userData.id,
              email: userData.email || `fb_${userData.id}@neurolearn.temp`, // Facebook puede no dar email
              name: firstName,
              lastName: lastNameParts.join(' '),
              avatar: userData.picture?.data?.url || null,
              emailVerified: !!userData.email
            };

            this._completeOAuthLogin(authData);
          } else {
            this._showError('No se pudo obtener información de Facebook');
          }
        });
      } else {
        // Usuario canceló el login
        console.log('Usuario canceló login de Facebook');
      }
    }, { scope: 'public_profile,email' });
  },

  // ── Completar login OAuth ────────────────────────────────
  _completeOAuthLogin(userData) {
    console.log('✅ Usuario autenticado:', userData);

    // Determinar rol por defecto (puede personalizarse después)
    // Por ahora asumimos que es un estudiante
    const role = 'student';

    // Actualizar estado global
    NLState.session.isLoggedIn = true;
    NLState.session.role = role;
    NLState.session.userId = userData.id;
    NLState.session.provider = userData.provider;

    // Actualizar datos del estudiante
    if (role === 'student') {
      NLState.student.name = userData.name;
      NLState.student.lastName = userData.lastName;
      NLState.student.avatar = userData.avatar || '👦';
      NLState.student.email = userData.email;
    }

    // Persistir sesión
    NLState._persist();

    // Mostrar modal de bienvenida con selección de rol
    this._showRoleSelection(userData);
  },

  _showRoleSelection(userData) {
    const modal = document.createElement('div');
    modal.className = 'oauth-role-modal';
    modal.innerHTML = `
      <div class="oauth-overlay"></div>
      <div class="oauth-card">
        <div class="oauth-header">
          <div class="oauth-avatar">${userData.avatar ? `<img src="${userData.avatar}" alt="${userData.name}">` : '👤'}</div>
          <h2>¡Hola, ${userData.name}! 👋</h2>
          <p>¿Cómo vas a usar NeuroLearn Kids?</p>
        </div>
        <div class="oauth-roles">
          <button class="oauth-role-btn" onclick="NLOAuth._selectRole('student', '${userData.name}')">
            <div class="role-icon">👦</div>
            <div class="role-title">Soy Estudiante</div>
            <div class="role-desc">Quiero aprender y practicar</div>
          </button>
          <button class="oauth-role-btn" onclick="NLOAuth._selectRole('teacher', '${userData.name}')">
            <div class="role-icon">👩‍🏫</div>
            <div class="role-title">Soy Docente</div>
            <div class="role-desc">Voy a monitorear estudiantes</div>
          </button>
          <button class="oauth-role-btn" onclick="NLOAuth._selectRole('parent', '${userData.name}')">
            <div class="role-icon">👪</div>
            <div class="role-title">Soy Padre/Madre</div>
            <div class="role-desc">Quiero seguir a mi hijo</div>
          </button>
        </div>
      </div>
    `;

    // Inject styles if not already present
    if (!document.getElementById('oauth-modal-styles')) {
      const styles = document.createElement('style');
      styles.id = 'oauth-modal-styles';
      styles.textContent = `
        .oauth-role-modal {
          position: fixed;
          inset: 0;
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          animation: fadeIn 0.3s ease;
        }
        .oauth-overlay {
          position: absolute;
          inset: 0;
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(8px);
        }
        .oauth-card {
          position: relative;
          background: white;
          border-radius: 1.5rem;
          max-width: 500px;
          width: 100%;
          padding: 2.5rem;
          box-shadow: 0 25px 60px rgba(0,0,0,0.3);
          animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .oauth-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .oauth-avatar {
          width: 80px;
          height: 80px;
          margin: 0 auto 1rem;
          border-radius: 50%;
          overflow: hidden;
          background: linear-gradient(135deg, #667eea, #764ba2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
        }
        .oauth-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .oauth-header h2 {
          font-family: 'Fredoka', sans-serif;
          font-size: 1.75rem;
          margin-bottom: 0.5rem;
        }
        .oauth-header p {
          color: #64748B;
          font-size: 0.95rem;
        }
        .oauth-roles {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .oauth-role-btn {
          width: 100%;
          padding: 1.25rem;
          border: 2px solid #E2E8F0;
          background: white;
          border-radius: 1rem;
          cursor: pointer;
          transition: all 0.3s;
          text-align: left;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .oauth-role-btn:hover {
          border-color: #7C3AED;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(124,58,237,0.2);
        }
        .role-icon {
          font-size: 2.5rem;
          flex-shrink: 0;
        }
        .role-title {
          font-family: 'Fredoka', sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }
        .role-desc {
          font-size: 0.85rem;
          color: #64748B;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `;
      document.head.appendChild(styles);
    }

    document.body.appendChild(modal);
  },

  _selectRole(role, name) {
    // Actualizar rol en estado
    NLState.session.role = role;
    NLState._persist();

    // Cerrar modal
    const modal = document.querySelector('.oauth-role-modal');
    if (modal) modal.remove();

    // Mostrar toast de bienvenida
    NLRouter._showToast(`¡Bienvenido, ${name}! 🎉`, 'success');

    // Determinar destino según rol y si completó evaluación
    setTimeout(() => {
      // Solo los estudiantes necesitan evaluación diagnóstica
      if (role === 'student' && !NLState.evaluation.completed) {
        // Primera vez → Evaluación diagnóstica
        window.location.href = 'diagnostic-evaluation.html';
      } else {
        // Ya completó evaluación o es docente/padre
        const routes = {
          student: 'student-dashboard.html',
          teacher: 'teacher-dashboard.html',
          parent: 'parent-dashboard.html'
        };
        window.location.href = routes[role] || 'student-dashboard.html';
      }
    }, 1500);
  },

  // ── Helpers ──────────────────────────────────────────────
  _decodeJWT(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map(c => 
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join('')
    );
    return JSON.parse(jsonPayload);
  },

  _showError(message) {
    if (typeof NLRouter !== 'undefined' && NLRouter._showToast) {
      NLRouter._showToast(message, 'error');
    } else {
      alert(message);
    }
  },

  // ── Modo Demo (para desarrollo sin credenciales reales) ──
  demoLogin(provider) {
    const demoUsers = {
      google: {
        provider: 'google',
        id: 'demo_google_123',
        email: 'demo@gmail.com',
        name: 'Demo',
        lastName: 'Google',
        avatar: '👤',
        emailVerified: true
      },
      facebook: {
        provider: 'facebook',
        id: 'demo_fb_456',
        email: 'demo@facebook.com',
        name: 'Demo',
        lastName: 'Facebook',
        avatar: '👤',
        emailVerified: true
      }
    };

    const userData = demoUsers[provider];
    if (userData) {
      this._completeOAuthLogin(userData);
    }
  }
};

// Auto-inicializar SDKs al cargar la página
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Pre-cargar SDKs en background
    setTimeout(() => {
      NLOAuth.initGoogle();
      NLOAuth.initFacebook();
    }, 1000);
  });
} else {
  setTimeout(() => {
    NLOAuth.initGoogle();
    NLOAuth.initFacebook();
  }, 1000);
}