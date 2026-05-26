# 🔐 Configuración de OAuth - NeuroLearn Kids

## 📋 Resumen

El sistema de autenticación social está implementado con:
- ✅ **Google OAuth 2.0** (Google Identity Services)
- ✅ **Facebook Login SDK**
- ✅ Modal de selección de rol (Estudiante/Docente/Padre)
- ✅ Modo demo para desarrollo

---

## 🚀 Inicio Rápido (Modo Demo)

Para probar el sistema **sin configurar credenciales OAuth reales**:

1. Abre `login-register.html`
2. Abre la consola del navegador (F12)
3. Ejecuta uno de estos comandos:

```javascript
NLOAuth.demoLogin('google')    // Simula login con Google
NLOAuth.demoLogin('facebook')  // Simula login con Facebook
```

Esto abrirá el modal de selección de rol y te permitirá probar el flujo completo.

---

## 🔧 Configuración para Producción

### 1️⃣ Google OAuth

#### a) Crear proyecto en Google Cloud Console

1. Ve a https://console.cloud.google.com/
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita **Google Identity Services API**
4. Ve a **Credenciales** → **Crear credenciales** → **ID de cliente de OAuth 2.0**
5. Tipo de aplicación: **Aplicación web**
6. Agrega tus URLs autorizadas:
   - Orígenes de JavaScript autorizados:
     ```
     http://localhost:5500
     http://127.0.0.1:5500
     https://tudominio.com
     ```
   - URI de redireccionamiento autorizados:
     ```
     http://localhost:5500/login-register.html
     https://tudominio.com/login-register.html
     ```

7. Copia el **Client ID** (termina en `.apps.googleusercontent.com`)

#### b) Actualizar código

En `oauth.js`, reemplaza esta línea:

```javascript
clientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
```

Por:

```javascript
clientId: 'TU_CLIENT_ID_REAL.apps.googleusercontent.com',
```

---

### 2️⃣ Facebook Login

#### a) Crear aplicación en Facebook for Developers

1. Ve a https://developers.facebook.com/apps/
2. Crea una nueva aplicación
3. Selecciona **Consumidor** como caso de uso
4. Agrega el producto **Facebook Login**
5. En la configuración de Facebook Login, agrega tus URLs:
   - URLs de OAuth Redirect válidas:
     ```
     http://localhost:5500/login-register.html
     https://tudominio.com/login-register.html
     ```
6. Copia el **App ID** desde **Configuración → Básica**

#### b) Actualizar código

En `oauth.js`, reemplaza esta línea:

```javascript
appId: 'YOUR_FACEBOOK_APP_ID',
```

Por:

```javascript
appId: 'TU_APP_ID_REAL',
```

---

## 🎯 Flujo de Autenticación

```
Usuario hace clic en "Continuar con Google/Facebook"
    ↓
SDK se carga (si no está cargado)
    ↓
Se abre popup de autenticación
    ↓
Usuario se autentica en Google/Facebook
    ↓
Sistema recibe credenciales (email, nombre, foto)
    ↓
Modal de selección de rol aparece
    ↓
Usuario selecciona: Estudiante / Docente / Padre
    ↓
Sesión se guarda en NLState
    ↓
Redirección al dashboard correspondiente
```

---

## 🛠️ Estructura del Sistema

### `oauth.js` - Módulo Principal

```javascript
NLOAuth.loginWithGoogle()     // Iniciar login con Google
NLOAuth.loginWithFacebook()   // Iniciar login con Facebook
NLOAuth.demoLogin(provider)   // Modo demo para desarrollo
```

### Datos del Usuario OAuth

Después del login exitoso, `NLState` contiene:

```javascript
{
  session: {
    isLoggedIn: true,
    role: 'student',        // o 'teacher' o 'parent'
    userId: 'google_123...',
    provider: 'google'      // o 'facebook'
  },
  student: {
    name: 'Juan',
    lastName: 'Pérez',
    email: 'juan@gmail.com',
    avatar: 'https://...'   // URL de foto de perfil
  }
}
```

---

## 🔒 Seguridad

### Producción

- ✅ Usar HTTPS obligatoriamente
- ✅ Validar tokens en el backend
- ✅ No confiar solo en autenticación del frontend
- ✅ Implementar CSRF protection
- ✅ Rate limiting en endpoints de autenticación

### Variables de Entorno

Para máxima seguridad, guarda las credenciales en variables de entorno:

```javascript
// En un archivo .env (no subir a Git)
GOOGLE_CLIENT_ID=tu_client_id
FACEBOOK_APP_ID=tu_app_id

// En oauth.js
config: {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || 'fallback_dev'
  }
}
```

---

## 🎨 Personalización

### Modal de Selección de Rol

Ubicación: `oauth.js` → método `_showRoleSelection()`

Puedes personalizar:
- Iconos de roles
- Textos descriptivos
- Estilos CSS
- Agregar campos adicionales (grado escolar, nombre de escuela, etc.)

### Botones de Login

Ubicación: `login-register.html` → sección social buttons

Personaliza:
- Colores
- Tamaño
- Iconos
- Texto

---

## 📱 Responsive

El sistema OAuth funciona en:
- ✅ Desktop (popup)
- ✅ Mobile (redirección fullscreen)
- ✅ Tablets

---

## 🐛 Troubleshooting

### "No se pudo conectar con Google"

1. Verifica que el Client ID sea correcto
2. Asegúrate de que la URL esté en la lista de orígenes autorizados
3. Revisa la consola del navegador para errores específicos

### "No se pudo conectar con Facebook"

1. Verifica que el App ID sea correcto
2. Asegúrate de que Facebook Login esté habilitado
3. Revisa que tu dominio esté en URLs de OAuth Redirect

### Modal no aparece

1. Abre consola del navegador (F12)
2. Busca errores de JavaScript
3. Verifica que `NLState` y `NLRouter` estén cargados

---

## 📊 Analytics (Opcional)

Para trackear logins sociales:

```javascript
// En oauth.js, método _completeOAuthLogin()
// Agregar después de la línea NLState._persist():

if (typeof gtag !== 'undefined') {
  gtag('event', 'login', {
    method: userData.provider
  });
}
```

---

## 🚦 Estado Actual

- ✅ Google OAuth implementado
- ✅ Facebook Login implementado
- ✅ Modal de selección de rol
- ✅ Persistencia de sesión
- ✅ Modo demo para desarrollo
- ⏳ Backend de validación de tokens (pendiente)
- ⏳ Refresh tokens (pendiente)
- ⏳ Logout de sesión OAuth (pendiente)

---

## 📞 Soporte

Para dudas o problemas, consulta:
- Google: https://developers.google.com/identity
- Facebook: https://developers.facebook.com/docs/facebook-login