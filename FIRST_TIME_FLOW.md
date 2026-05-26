# 🎯 Guía: Flujo de Primera Vez - Evaluación Diagnóstica

## 📋 Resumen

El sistema ahora detecta automáticamente cuando un estudiante inicia sesión por primera vez y lo redirige a una **evaluación diagnóstica** antes de acceder al dashboard.

---

## 🔄 Flujo Completo

```
1. Usuario hace login/OAuth
         ↓
2. Selecciona rol "Estudiante"
         ↓
3. Sistema detecta: evaluation.completed = false
         ↓
4. Redirige a diagnostic-evaluation.html
         ↓
5. Muestra pantalla de bienvenida explicativa
         ↓
6. Usuario hace clic "🚀 Comenzar Evaluación"
         ↓
7. Responde 12 preguntas (6 Math + 6 Español)
         ↓
8. Al terminar: evaluation.completed = true
         ↓
9. Muestra resultados (Math: X%, Español: Y%)
         ↓
10. Redirige a student-dashboard.html
         ↓
11. ✅ Próximos logins → directo al dashboard
```

---

## 🧪 Cómo Probar

### Opción 1: Demo Login Rápido (Modo Desarrollo)

1. Abre `login-register.html`
2. Abre consola del navegador (**F12**)
3. Ejecuta:
```javascript
simulateFirstTimeLogin()
```

Esto hará:
- ✅ Resetear estado a usuario nuevo
- ✅ Simular login con Google
- ✅ Abrir modal de selección de rol
- ✅ (Tú seleccionas "Estudiante")
- ✅ Ver pantalla de bienvenida del diagnóstico

---

### Opción 2: Resetear Manualmente

Si ya hiciste la evaluación y quieres probar de nuevo:

```javascript
// En consola del navegador:
resetFirstTimeUser()
```

Luego recarga la página (F5) y haz login normalmente.

---

### Opción 3: Saltar Diagnóstico (Para Desarrollo)

Si quieres probar el dashboard sin hacer la evaluación:

```javascript
skipDiagnostic()
```

Esto marca la evaluación como completada con resultados simulados (Math: 75%, Español: 80%).

---

## 🎨 Pantalla de Bienvenida

Cuando el estudiante llega a la evaluación por primera vez, ve:

### Contenido:
- 🎯 **Título**: "¡Bienvenido a tu Evaluación Diagnóstica!"
- 📝 **Explicación**: Qué es y para qué sirve
- 📊 **Información clave**:
  - ⏱️ 10 minutos estimados
  - 📝 12 preguntas (6 Math + 6 Español)
  - 🎮 Nivel adaptativo
- 💡 **Tips**:
  - Lee con calma
  - No hay respuestas incorrectas
  - Puedes saltar preguntas

### Botón:
🚀 **"¡Comenzar Evaluación!"**

Al hacer clic, desaparece el overlay y comienza la evaluación.

---

## 🔧 Archivos Modificados

### 1. `oauth.js`
```javascript
_selectRole(role, name) {
  // ...
  if (role === 'student' && !NLState.evaluation.completed) {
    window.location.href = 'diagnostic-evaluation.html';
  }
}
```

### 2. `auth.js`
```javascript
login(username, password) {
  // ...
  if (user.role === 'student' && !NLState.evaluation.completed) {
    NLRouter.go('evaluation');
  }
}
```

### 3. `diagnostic-evaluation.html`
- ✅ Overlay de bienvenida añadido
- ✅ Estilos con animación bounce
- ✅ Solo se muestra la primera vez

### 4. `nl-init.js`
```javascript
NLPageEval.init() {
  const showIntro = !NLState.evaluation.active && !NLState.evaluation.completed;
  if (showIntro) {
    // Mostrar intro
    return;
  }
  // Continuar con evaluación...
}
```

---

## 🎮 Casos de Uso

### ✅ Estudiante Nuevo
1. Login → Selecciona "Estudiante"
2. Ve pantalla de bienvenida
3. Hace evaluación
4. Va al dashboard
5. Próximos logins → directo al dashboard

### ✅ Docente/Padre Nuevo
1. Login → Selecciona "Docente" o "Padre"
2. Va directo a su dashboard (no necesitan evaluación)

### ✅ Estudiante que ya hizo la evaluación
1. Login
2. Va directo al dashboard (evaluation.completed = true)

### ✅ Estudiante que cerró el navegador a mitad de evaluación
1. Login
2. Continúa la evaluación donde la dejó (evaluation.active = true)

---

## 🛠️ Herramientas de Testing

Todas las páginas ahora incluyen `reset-first-time.js` que proporciona:

```javascript
// Ver estado actual
showUserStatus()

// Resetear a usuario nuevo
resetFirstTimeUser()

// Marcar evaluación como completada
skipDiagnostic()

// Simular login completo
simulateFirstTimeLogin()
```

Estas funciones están disponibles **siempre** en la consola del navegador.

---

## 📊 Estado de la Evaluación

El estado se guarda en `NLState.evaluation`:

```javascript
{
  completed: false,    // true después de terminar
  active: false,       // true durante la evaluación
  score: {
    math: 0,          // 0-100
    spanish: 0        // 0-100
  }
}
```

Este estado persiste en `localStorage`, así que:
- ✅ Sobrevive recargas de página
- ✅ Sobrevive cierre de navegador
- ❌ Se pierde si el usuario borra cookies/storage

---

## 🔒 Lógica de Detección

```javascript
// Primera vez = ambos son false
!evaluation.completed && !evaluation.active

// Durante evaluación
!evaluation.completed && evaluation.active

// Ya completó
evaluation.completed === true
```

---

## 🎯 Personalización

### Cambiar tiempo de evaluación

En `diagnostic-evaluation.html`, línea del feature:
```html
<strong>10 minutos</strong>
<span>Tiempo estimado</span>
```

### Cambiar número de preguntas

En `adaptive.js`:
```javascript
getDiagnosticQuestions() {
  return [
    // Agregar más preguntas aquí
  ];
}
```

### Cambiar texto del intro

En `diagnostic-evaluation.html`, dentro del `#diagnostic-intro`.

---

## ⚠️ Importante

1. **Solo estudiantes** hacen la evaluación diagnóstica
2. **Docentes y padres** van directo a su dashboard
3. La evaluación **se marca como completada** cuando el usuario llega a la pantalla de resultados
4. Si el usuario **cierra el navegador** durante la evaluación, al volver continuará donde se quedó (porque `evaluation.active = true`)

---

## 🐛 Troubleshooting

### "No se muestra la pantalla de bienvenida"

Ejecuta en consola:
```javascript
showUserStatus()
```

Si `evaluation.completed = true`, resetea:
```javascript
resetFirstTimeUser()
```

### "Voy directo al dashboard sin ver la evaluación"

Verifica:
1. ¿Eres estudiante? (no docente/padre)
2. ¿evaluation.completed = false?
3. ¿Hay errores en consola?

### "La evaluación no se marca como completada"

Verifica que llegues hasta el final (pantalla de resultados con botón "Comenzar a Aprender").

---

## 📞 Preguntas Frecuentes

**P: ¿Puedo omitir la evaluación?**
R: Sí, en consola: `skipDiagnostic()`

**P: ¿Puedo cambiar los resultados de la evaluación?**
R: Sí, edita `NLState.evaluation.score` y llama `NLState._persist()`

**P: ¿Cómo hago que todos los usuarios nuevos hagan la evaluación?**
R: Ya está implementado. Solo asegúrate de que `evaluation.completed` empiece en `false`.

**P: ¿Docentes y padres también hacen evaluación?**
R: No. Solo estudiantes.

---

## ✅ Checklist de Implementación

- [x] Detectar primera vez en OAuth
- [x] Detectar primera vez en login normal
- [x] Pantalla de bienvenida antes de evaluación
- [x] Guardar `evaluation.completed = true` al terminar
- [x] Redirigir a dashboard después de evaluación
- [x] Saltar evaluación en próximos logins
- [x] Solo estudiantes hacen evaluación
- [x] Herramientas de testing en consola
- [x] Persistencia de estado en localStorage