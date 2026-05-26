// ===================================================
// auth.js — Autenticación NeuroLearn Kids
// ===================================================

const NLAuth = {

  // Usuarios mock para demo
  mockUsers: [
    { id: 'stu-001', user: 'miguel', pass: '1234', role: 'student',  name: 'Miguel Hernández' },
    { id: 'tch-001', user: 'profa',  pass: '1234', role: 'teacher',  name: 'Profa. María González' },
    { id: 'par-001', user: 'laura',  pass: '1234', role: 'parent',   name: 'Laura Hernández' },
  ],

  // ── Iniciar sesión ───────────────────────────────
  login(username, password) {
    const user = this.mockUsers.find(u =>
      (u.user === username.toLowerCase().trim() || u.id === username) &&
      u.pass === password
    );

    if (!user) return { ok: false, msg: 'Usuario o contraseña incorrectos' };

    NLState.login(user.role, { username, password });

    // Redirect según rol
    const redirectMap = {
      student: () => {
        if (!NLState.evaluation.completed) {
          NLRouter._showToast('✅ ¡Bienvenido! Primero haremos una evaluación', 'success');
          setTimeout(() => NLRouter.go('evaluation'), 1200);
        } else {
          NLRouter._showToast(`¡Hola de nuevo, ${user.name.split(' ')[0]}! 👋`, 'success');
          setTimeout(() => NLRouter.go('student'), 1200);
        }
      },
      teacher: () => {
        NLRouter._showToast(`Bienvenida, ${user.name} 👩‍🏫`, 'success');
        setTimeout(() => NLRouter.go('teacher'), 1200);
      },
      parent: () => {
        NLRouter._showToast(`Hola, ${user.name.split(' ')[0]} 👋`, 'success');
        setTimeout(() => NLRouter.go('parent'), 1200);
      },
    };

    redirectMap[user.role]?.();
    return { ok: true, user };
  },

  // ── Registrar nuevo usuario ──────────────────────
  register(data) {
    const { name, lastName, email, grade, school, password, role } = data;

    if (!name || !email || !password) return { ok: false, msg: 'Completa todos los campos' };
    if (password.length < 6) return { ok: false, msg: 'La contraseña debe tener al menos 6 caracteres' };

    const newUser = {
      id: role + '-' + Date.now(),
      user: email.split('@')[0],
      pass: password,
      role,
      name: `${name} ${lastName}`,
    };

    this.mockUsers.push(newUser);
    NLState.student.name = name;
    NLState.student.lastName = lastName;
    NLState.student.grade = grade;
    NLState.student.school = school;

    NLState.login(role, { email, password });
    NLRouter._showToast('🎉 ¡Cuenta creada exitosamente!', 'success');
    setTimeout(() => NLRouter.go('evaluation'), 1200);
    return { ok: true };
  },

  // ── Cerrar sesión ────────────────────────────────
  logout() {
    NLState.clearSession();
    NLRouter._showToast('Sesión cerrada. ¡Hasta pronto! 👋', 'info');
    setTimeout(() => { window.location.href = 'landing-page.html'; }, 1000);
  },
};