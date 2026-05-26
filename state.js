// ============================================================
// state.js — Estado Global v2.0
// Gamificación, progreso real, historial de sesiones
// ============================================================

const NLState = {

  session: { isLoggedIn:false, role:null, userId:null, token:null },

  student: {
    id:'stu-001', name:'Miguel', lastName:'Hernández',
    grade:'2° Primaria', school:'Escuela Benito Juárez', avatar:'👦',
    points: 0, streakDays: 0, lastActiveDate: null,
    level: 'Explorador',
    subjects: {
      math:    { level:1, accuracy:0, totalAnswered:0, totalCorrect:0, currentDifficulty:'easy',
                 consecutiveErrors:0, consecutiveCorrect:0, avgTime:0, errorLog:[], sessions:[] },
      spanish: { level:1, accuracy:0, totalAnswered:0, totalCorrect:0, currentDifficulty:'easy',
                 consecutiveErrors:0, consecutiveCorrect:0, avgTime:0, errorLog:[], sessions:[] },
    },
    achievements: [],   // IDs de logros desbloqueados
    notifications: [],  // alertas para este alumno
  },

  teacher: {
    id:'tch-001', name:'María', lastName:'González',
    avatar:'👩‍🏫', group:'2° A', school:'Escuela Benito Juárez',
    students: [
      { id:'stu-001', name:'Miguel Hernández',  grade:'2° A', mathAcc:85, spanishAcc:92, sessions:7, risk:'bajo',  streak:7  },
      { id:'stu-002', name:'Ana Martínez',      grade:'2° A', mathAcc:72, spanishAcc:88, sessions:5, risk:'medio', streak:3  },
      { id:'stu-003', name:'Carlos López',      grade:'2° A', mathAcc:45, spanishAcc:60, sessions:2, risk:'alto',  streak:0  },
      { id:'stu-004', name:'Sofía Ramírez',     grade:'2° A', mathAcc:91, spanishAcc:95, sessions:7, risk:'bajo',  streak:7  },
      { id:'stu-005', name:'Luis Torres',       grade:'2° A', mathAcc:63, spanishAcc:71, sessions:4, risk:'medio', streak:2  },
      { id:'stu-006', name:'Valentina Cruz',    grade:'2° A', mathAcc:88, spanishAcc:82, sessions:6, risk:'bajo',  streak:5  },
    ],
  },

  parent: {
    id:'par-001', name:'Laura', lastName:'Hernández', avatar:'👩',
    children: ['stu-001'],
  },

  evaluation: { active:false, completed:false, score:{ math:0, spanish:0 } },

  exercise: {
    subject: 'math', difficulty: 'easy',
    consecutiveErrors:0, consecutiveCorrect:0,
    usedIds: [], sessionAnswers: [],
  },

  // ── Catálogo de logros ───────────────────────────────────
  achievementsCatalog: [
    { id:'primera-victoria', icon:'🎯', name:'Primera Victoria',    desc:'Completa tu primer ejercicio',         req: s => s.subjects.math.totalAnswered + s.subjects.spanish.totalAnswered >= 1 },
    { id:'racha-3',          icon:'🔥', name:'Racha de 3 días',      desc:'Accede 3 días consecutivos',           req: s => s.streakDays >= 3   },
    { id:'racha-7',          icon:'🔥', name:'Racha de 7 días',      desc:'Accede 7 días consecutivos',           req: s => s.streakDays >= 7   },
    { id:'super-rapido',     icon:'⚡', name:'Súper Rápido',         desc:'Responde en menos de 5 segundos',      req: s => (s.subjects.math.avgTime > 0 && s.subjects.math.avgTime < 5) || (s.subjects.spanish.avgTime > 0 && s.subjects.spanish.avgTime < 5) },
    { id:'10-correctas',     icon:'✅', name:'10 Respuestas',         desc:'Acierta 10 respuestas en total',       req: s => (s.subjects.math.totalCorrect + s.subjects.spanish.totalCorrect) >= 10 },
    { id:'nivel-2-math',     icon:'🔢', name:'Nivel 2 Matemáticas',  desc:'Alcanza el nivel 2 en Matemáticas',    req: s => s.subjects.math.level >= 2 },
    { id:'nivel-2-esp',      icon:'📚', name:'Nivel 2 Español',      desc:'Alcanza el nivel 2 en Español',        req: s => s.subjects.spanish.level >= 2 },
    { id:'precision-90',     icon:'🏹', name:'Precisión 90%',        desc:'Mantén 90% de precisión en una sesión',req: s => s.subjects.math.accuracy >= 90 || s.subjects.spanish.accuracy >= 90 },
    { id:'100-puntos',       icon:'⭐', name:'100 Puntos',            desc:'Acumula 100 puntos',                   req: s => s.points >= 100   },
    { id:'1000-puntos',      icon:'💎', name:'1000 Puntos',           desc:'Acumula 1000 puntos',                  req: s => s.points >= 1000  },
  ],

  // ── Registrar respuesta ──────────────────────────────────
  recordAnswer(subject, correct, time, topic, difficulty) {
    const sub = this.student.subjects[subject];

    sub.totalAnswered++;
    if (correct) {
      sub.totalCorrect++;
      sub.consecutiveErrors   = 0;
      sub.consecutiveCorrect++;
      this.exercise.consecutiveErrors   = 0;
      this.exercise.consecutiveCorrect++;
    } else {
      sub.consecutiveCorrect  = 0;
      sub.consecutiveErrors++;
      this.exercise.consecutiveCorrect  = 0;
      this.exercise.consecutiveErrors++;
      sub.errorLog.push({ topic, difficulty, time, date: Date.now() });
    }

    // Actualizar accuracy (media móvil)
    sub.accuracy = sub.totalAnswered > 0
      ? Math.round((sub.totalCorrect / sub.totalAnswered) * 100) : 0;

    // Actualizar avgTime (media móvil)
    sub.avgTime = sub.avgTime === 0
      ? parseFloat(time.toFixed(1))
      : parseFloat(((sub.avgTime * 0.85) + (time * 0.15)).toFixed(1));

    // Ajustar nivel
    this._updateLevel(subject);

    // Puntos
    const pts = correct ? (difficulty === 'hard' ? 20 : difficulty === 'medium' ? 15 : 10) : 0;
    this.student.points += pts;

    // Racha
    this._updateStreak();

    // Guardar en historial de sesión
    this.exercise.sessionAnswers.push({ subject, correct, time, topic, difficulty, pts });
    this.exercise.usedIds.push('placeholder'); // se gestiona en NLPageExercise

    // Detectar logros
    const newAchievements = this._checkAchievements();

    this._persist();
    return { pts, newAchievements };
  },

  _updateLevel(subject) {
    const sub = this.student.subjects[subject];
    if (sub.totalAnswered < 5) return;
    if (sub.accuracy >= 85 && sub.totalCorrect >= 8  && sub.level < 2) { sub.level = 2; sub.consecutiveCorrect = 0; }
    if (sub.accuracy >= 88 && sub.totalCorrect >= 20 && sub.level < 3) { sub.level = 3; }
    // Actualizar nivel global del alumno
    const maxLevel = Math.max(this.student.subjects.math.level, this.student.subjects.spanish.level);
    this.student.level = maxLevel >= 3 ? 'Maestro Cósmico' : maxLevel === 2 ? 'Astronauta' : 'Explorador';
  },

  _updateStreak() {
    const today = new Date().toDateString();
    const last  = this.student.lastActiveDate;
    if (last === today) return;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    this.student.streakDays = (last === yesterday) ? this.student.streakDays + 1 : 1;
    this.student.lastActiveDate = today;
  },

  _checkAchievements() {
    const unlocked = [];
    const s = this.student;
    this.achievementsCatalog.forEach(a => {
      if (!s.achievements.includes(a.id) && a.req(s)) {
        s.achievements.push(a.id);
        s.notifications.push({ type:'achievement', achievementId: a.id, date: Date.now() });
        unlocked.push(a);
      }
    });
    return unlocked;
  },

  getAchievement(id) {
    return this.achievementsCatalog.find(a => a.id === id);
  },

  // ── Construir datos para reportes ───────────────────────
  buildReportData() {
    const m = this.student.subjects.math;
    const s = this.student.subjects.spanish;

    const errorPattern = NLAdaptive.detectErrorPattern([...m.errorLog, ...s.errorLog]);
    const risk = NLAdaptive.calculateRisk({
      mathAcc: m.accuracy, spanishAcc: s.accuracy,
      avgTime: Math.max(m.avgTime, s.avgTime),
      consecutiveErrors: Math.max(m.consecutiveErrors, s.consecutiveErrors),
      sessionsWeek: this.student.streakDays,
      errorPattern,
    });
    const recs = NLAdaptive.generateRecommendations(
      { errorPattern, avgTime: Math.max(m.avgTime, s.avgTime),
        sessionsWeek: this.student.streakDays,
        weakestSubject: m.accuracy <= s.accuracy ? 'math' : 'spanish' },
      risk
    );
    return { math: m, spanish: s, risk, recs, errorPattern, student: this.student };
  },

  // ── Persistencia ────────────────────────────────────────
  login(role) {
    this.session = { isLoggedIn:true, role, userId: role+'-001', token:'jwt-'+Date.now() };
    try { sessionStorage.setItem('nl_session', JSON.stringify(this.session)); } catch(e) {}
    this._persist();
  },

  clearSession() {
    try { sessionStorage.removeItem('nl_session'); localStorage.removeItem('nl_progress'); } catch(e) {}
    this.session = { isLoggedIn:false, role:null, userId:null, token:null };
  },

  _persist() {
    try {
      sessionStorage.setItem('nl_session', JSON.stringify(this.session));
      localStorage.setItem('nl_progress', JSON.stringify({
        points: this.student.points, streakDays: this.student.streakDays,
        lastActiveDate: this.student.lastActiveDate, level: this.student.level,
        achievements: this.student.achievements,
        subjects: this.student.subjects,
        evaluation: this.evaluation,
      }));
    } catch(e) {}
  },

  init() {
    try {
      const sess = JSON.parse(sessionStorage.getItem('nl_session') || 'null');
      if (sess?.isLoggedIn) this.session = { ...this.session, ...sess };

      const prog = JSON.parse(localStorage.getItem('nl_progress') || 'null');
      if (prog) {
        this.student.points         = prog.points         ?? 0;
        this.student.streakDays     = prog.streakDays     ?? 0;
        this.student.lastActiveDate = prog.lastActiveDate ?? null;
        this.student.level          = prog.level          ?? 'Explorador';
        this.student.achievements   = prog.achievements   ?? [];
        if (prog.subjects) this.student.subjects = prog.subjects;
        if (prog.evaluation) this.evaluation = { ...this.evaluation, ...prog.evaluation };
      }
    } catch(e) {}
  },
};

NLState.init();