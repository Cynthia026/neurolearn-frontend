// ============================================================
// reset-first-time.js — Script para probar flujo de primera vez
// Ejecuta en consola del navegador para simular usuario nuevo
// ============================================================

/**
 * Resetea el estado para simular un usuario nuevo
 * Útil para probar el flujo de evaluación diagnóstica
 */
function resetFirstTimeUser() {
  console.log('🔄 Reseteando estado de usuario...');
  
  // Limpiar storage
  try {
    localStorage.clear();
    sessionStorage.clear();
    console.log('✅ Storage limpiado');
  } catch(e) {
    console.error('❌ Error limpiando storage:', e);
  }
  
  // Resetear estado en memoria
  if (typeof NLState !== 'undefined') {
    NLState.session.isLoggedIn = false;
    NLState.session.role = null;
    NLState.evaluation.completed = false;
    NLState.evaluation.active = false;
    NLState.student.points = 0;
    NLState.student.streakDays = 0;
    NLState.student.achievements = [];
    console.log('✅ NLState reseteado');
  }
  
  console.log('');
  console.log('✨ Usuario reseteado a estado inicial');
  console.log('');
  console.log('📋 Para probar el flujo completo:');
  console.log('  1. Recarga la página (F5)');
  console.log('  2. Haz login (o usa: NLOAuth.demoLogin("google"))');
  console.log('  3. Selecciona rol "Estudiante"');
  console.log('  4. Verás la pantalla de bienvenida del diagnóstico');
  console.log('  5. Completa la evaluación');
  console.log('  6. En el próximo login irás directo al dashboard');
}

/**
 * Marca la evaluación como completada sin hacerla
 * Útil para saltar el diagnóstico y probar el dashboard
 */
function skipDiagnostic() {
  console.log('⏭️ Saltando diagnóstico...');
  
  if (typeof NLState === 'undefined') {
    console.error('❌ NLState no está cargado');
    return;
  }
  
  NLState.evaluation.completed = true;
  NLState.evaluation.score = { math: 75, spanish: 80 };
  NLState.student.subjects.math.accuracy = 75;
  NLState.student.subjects.spanish.accuracy = 80;
  NLState.student.subjects.math.currentDifficulty = 'medium';
  NLState.student.subjects.spanish.currentDifficulty = 'medium';
  NLState._persist();
  
  console.log('✅ Diagnóstico marcado como completado');
  console.log('📊 Resultados simulados:');
  console.log('  • Matemáticas: 75%');
  console.log('  • Español: 80%');
  console.log('');
  console.log('💡 Ahora puedes ir al dashboard sin hacer la evaluación');
}

/**
 * Muestra el estado actual del usuario
 */
function showUserStatus() {
  if (typeof NLState === 'undefined') {
    console.error('❌ NLState no está cargado');
    return;
  }
  
  console.log('👤 Estado del Usuario:');
  console.log('');
  console.log('📊 Sesión:');
  console.log('  • Logueado:', NLState.session.isLoggedIn ? '✅ Sí' : '❌ No');
  console.log('  • Rol:', NLState.session.role || 'ninguno');
  console.log('');
  console.log('📝 Evaluación:');
  console.log('  • Completada:', NLState.evaluation.completed ? '✅ Sí' : '❌ No');
  console.log('  • Activa:', NLState.evaluation.active ? '✅ Sí' : '❌ No');
  console.log('  • Puntuación Math:', NLState.evaluation.score.math + '%');
  console.log('  • Puntuación Español:', NLState.evaluation.score.spanish + '%');
  console.log('');
  console.log('🎮 Progreso:');
  console.log('  • Puntos:', NLState.student.points);
  console.log('  • Racha:', NLState.student.streakDays, 'días');
  console.log('  • Logros desbloqueados:', NLState.student.achievements.length);
  console.log('  • Math accuracy:', NLState.student.subjects.math.accuracy + '%');
  console.log('  • Español accuracy:', NLState.student.subjects.spanish.accuracy + '%');
}

/**
 * Simula login completo de primera vez
 */
function simulateFirstTimeLogin() {
  console.log('🎭 Simulando login de primera vez...');
  
  resetFirstTimeUser();
  
  setTimeout(() => {
    if (typeof NLOAuth !== 'undefined') {
      NLOAuth.demoLogin('google');
      console.log('✅ Login simulado - se abrirá el modal de rol');
      console.log('💡 Selecciona "Estudiante" para ver el diagnóstico');
    } else {
      console.error('❌ NLOAuth no está cargado');
      console.log('💡 Recarga la página primero');
    }
  }, 1000);
}

// Exportar funciones globalmente para uso en consola
window.resetFirstTimeUser = resetFirstTimeUser;
window.skipDiagnostic = skipDiagnostic;
window.showUserStatus = showUserStatus;
window.simulateFirstTimeLogin = simulateFirstTimeLogin;

// Mensaje de bienvenida
console.log('');
console.log('═══════════════════════════════════════════════');
console.log('🧪 Testing Tools - NeuroLearn Kids');
console.log('═══════════════════════════════════════════════');
console.log('');
console.log('Funciones disponibles en consola:');
console.log('');
console.log('  resetFirstTimeUser()      → Resetear a usuario nuevo');
console.log('  skipDiagnostic()          → Marcar diagnóstico como completado');
console.log('  showUserStatus()          → Ver estado actual');
console.log('  simulateFirstTimeLogin()  → Simular login completo');
console.log('');
console.log('Ejemplos:');
console.log('  > resetFirstTimeUser()');
console.log('  > NLOAuth.demoLogin("google")');
console.log('  > showUserStatus()');
console.log('');
console.log('═══════════════════════════════════════════════');
console.log('');