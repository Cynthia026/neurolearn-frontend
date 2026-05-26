// ===================================================
// router.js — Motor de Navegación SPA NeuroLearn Kids
// ===================================================

const NLRouter = {

  // Mapa de pantallas → archivos HTML
  routes: {
    'landing':      'landing-page.html',
    'login':        'login-register.html',
    'register':     'login-register.html',
    'student':      'student-dashboard.html',
    'evaluation':   'diagnostic-evaluation.html',
    'exercise':     'exercise-interface.html',
    'teacher':      'teacher-dashboard.html',
    'parent':       'parent-dashboard.html',
    'report':       'progress-report.html',
  },

  // Rutas protegidas por rol
  protected: {
    'student':    'student',
    'evaluation': 'student',
    'exercise':   'student',
    'teacher':    'teacher',
    'parent':     'parent',
    'report':     ['student', 'teacher', 'parent'],
  },

  currentRoute: null,

  // ── Navegar a una pantalla ───────────────────────
  go(screen, params = {}) {
    // Guardar historial
    if (this.currentRoute) NLState.history.push(this.currentRoute);
    NLState.currentScreen = screen;
    this.currentRoute = screen;

    // Guardar parámetros opcionales
    NLRouter._params = params;

    // Verificar protección
    if (this.protected[screen]) {
      const allowedRole = this.protected[screen];
      const userRole = NLState.session.role;
      const allowed = Array.isArray(allowedRole)
        ? allowedRole.includes(userRole)
        : userRole === allowedRole;

      if (!NLState.session.isLoggedIn || !allowed) {
        this._showToast('🔒 Debes iniciar sesión primero', 'warning');
        setTimeout(() => this._loadPage('login-register.html'), 800);
        return;
      }
    }

    const file = this.routes[screen];
    if (file) {
      this._loadPage(file);
    } else {
      console.warn('[Router] Ruta no encontrada:', screen);
    }
  },

  // ── Ir atrás ────────────────────────────────────
  back() {
    if (NLState.history.length > 0) {
      const prev = NLState.history.pop();
      this.go(prev);
    } else {
      this.go('landing');
    }
  },

  // ── Cargar página en el mismo tab ───────────────
  _loadPage(file) {
    // Animación de salida
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.25s ease';
    setTimeout(() => { window.location.href = file; }, 250);
  },

  // ── Toast de notificación ───────────────────────
  _showToast(msg, type = 'info') {
    const colors = { info: '#3B82F6', success: '#10B981', warning: '#F59E0B', error: '#EF4444' };
    const t = document.createElement('div');
    t.innerHTML = msg;
    t.style.cssText = `
      position:fixed; bottom:2rem; left:50%; transform:translateX(-50%) translateY(100px);
      background:${colors[type]}; color:white; padding:1rem 2rem; border-radius:999px;
      font-family:'Fredoka',sans-serif; font-weight:600; font-size:1rem;
      box-shadow:0 10px 30px rgba(0,0,0,0.2); z-index:9999;
      transition:transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
    `;
    document.body.appendChild(t);
    requestAnimationFrame(() => { t.style.transform = 'translateX(-50%) translateY(0)'; });
    setTimeout(() => {
      t.style.transform = 'translateX(-50%) translateY(100px)';
      setTimeout(() => t.remove(), 400);
    }, 2500);
  },

  // ── Parámetros de navegación ────────────────────
  getParam(key) { return (this._params || {})[key]; },
  _params: {},
};