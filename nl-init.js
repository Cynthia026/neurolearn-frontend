// ============================================================
// nl-init.js  v3.0 — NeuroLearn Kids
// Un IIFE al final arrancar la pagina correcta.
// Todos los const estan definidos antes del arranque.
// ============================================================

var _page = window.location.pathname.split("/").pop().replace(".html","") || "landing-page";

const NLPageLanding = {
  init() {
    if (NLState.session.isLoggedIn) {
      const map = { student:'student-dashboard.html', teacher:'teacher-dashboard.html', parent:'parent-dashboard.html' };
      const dest = map[NLState.session.role];
      if (dest) this._showBanner(dest);
    }
  },
  _showBanner(href) {
    const names = { student: NLState.student.name, teacher: NLState.teacher.name, parent: NLState.parent.name };
    const roleLabel = NLState.session.role;
    const name = names[roleLabel] || '';
    const b = document.createElement('div');
    b.style.cssText = 'position:fixed;bottom:2rem;right:2rem;z-index:9000;background:white;border-radius:1.25rem;padding:1.25rem 1.75rem;box-shadow:0 10px 40px rgba(0,0,0,0.15);display:flex;align-items:center;gap:1rem;animation:nlSlideUp 0.4s ease;max-width:340px;';
    _injectKeyframes();
    b.innerHTML = `<div style="flex:1;"><div style="font-family:'Fredoka',sans-serif;font-size:0.8rem;color:#64748B;">Sesión activa</div><div style="font-family:'Fredoka',sans-serif;font-weight:700;color:#0F172A;">Bienvenido, ${name} 👋</div></div><button onclick="window.location.href='${href}'" style="padding:0.75rem 1.25rem;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:999px;font-family:'Fredoka',sans-serif;font-weight:600;cursor:pointer;font-size:0.9rem;">Ir a mi panel →</button><button onclick="NLAuth.logout()" style="background:none;border:none;font-size:1.4rem;cursor:pointer;color:#94A3B8;">×</button>`;
    document.body.appendChild(b);
  }
};

// ============================================================
// LOGIN / REGISTER
// ============================================================
const NLPageLogin = {
  init() {
    if (NLState.session.isLoggedIn) {
      const map = { student:'student-dashboard.html', teacher:'teacher-dashboard.html', parent:'parent-dashboard.html' };
      window.location.href = map[NLState.session.role] || 'landing-page.html';
    }
  },
  doLogin() {
    const user = document.getElementById('login-user')?.value?.trim() || '';
    const pass = document.getElementById('login-pass')?.value || '';
    if (!user || !pass) { NLRouter._showToast('⚠️ Ingresa usuario y contraseña', 'warning'); return; }
    const btn = document.getElementById('btn-login');
    if (btn) { btn.textContent = '⏳ Verificando...'; btn.disabled = true; }
    setTimeout(() => {
      const result = NLAuth.login(user, pass);
      if (!result.ok) {
        NLRouter._showToast('❌ ' + result.msg, 'error');
        if (btn) { btn.textContent = '🚀 Entrar a mi Aventura'; btn.disabled = false; }
      }
    }, 700);
  },
  doRegister() {
    const panel  = document.getElementById('panel-register');
    const inputs = panel?.querySelectorAll('input');
    const sel    = panel?.querySelectorAll('select');
    const roleEl = panel?.querySelector('.role-option.selected .role-label');
    const name     = inputs?.[0]?.value?.trim();
    const lastName = inputs?.[1]?.value?.trim();
    const email    = inputs?.[2]?.value?.trim();
    const grade    = sel?.[0]?.value;
    const school   = inputs?.[3]?.value?.trim();
    const password = inputs?.[4]?.value;
    const roleMap  = { 'Alumno':'student','Docente':'teacher','Padre/Madre':'parent' };
    const role     = roleMap[roleEl?.textContent] || 'student';
    if (!name || !email || !password) { NLRouter._showToast('⚠️ Completa los campos obligatorios', 'warning'); return; }
    const btn = document.getElementById('btn-register');
    if (btn) { btn.textContent = '⏳ Creando cuenta...'; btn.disabled = true; }
    setTimeout(() => {
      NLState.student.name     = name;
      NLState.student.lastName = lastName;
      NLState.student.grade    = grade || '2° Primaria';
      NLState.student.school   = school || '';
      const result = NLAuth.register({ name, lastName, email, grade, school, password, role });
      if (!result.ok) {
        NLRouter._showToast('❌ ' + result.msg, 'error');
        if (btn) { btn.textContent = '✨ Crear mi Cuenta Gratis'; btn.disabled = false; }
      }
    }, 900);
  },
};

// ============================================================
// STUDENT DASHBOARD
// ============================================================
const NLPageStudent = {
  init() {
    if (!NLState.session.isLoggedIn || NLState.session.role !== 'student') {
      window.location.href = 'login-register.html'; return;
    }
    this._renderData();
    this._showPendingAchievements();
  },

  _renderData() {
    const s = NLState.student;
    const m = s.subjects.math;
    const sp = s.subjects.spanish;

    // Nombre y saludo
    _setText('h2', `¡Hola, ${s.name}! 🚀`);

    // Puntos y racha
    _setAll('.streak-badge',    `🔥 ${s.streakDays} día${s.streakDays !== 1 ? 's' : ''} de racha`);
    _setAll('.points-display',  `⭐ ${s.points.toLocaleString()} puntos`);

    // Nivel
    _setAll('.level-badge',     `🚀 ${s.level}`);
    _setAll('.student-level',   s.level);

    // Barras de progreso de materias (Math)
    this._updateSubjectCard('math',    m.accuracy, m.level, m.currentDifficulty, m.totalAnswered);
    this._updateSubjectCard('spanish', sp.accuracy, sp.level, sp.currentDifficulty, sp.totalAnswered);

    // Logros
    this._renderAchievements();
  },

  _updateSubjectCard(subject, accuracy, level, diff, total) {
    const fills   = document.querySelectorAll(`.${subject}-fill, .progress-fill-${subject}`);
    const pcts    = document.querySelectorAll(`.${subject}-pct, .accuracy-${subject}`);
    const lvls    = document.querySelectorAll(`.${subject}-level`);
    fills.forEach(el => { el.style.width = accuracy + '%'; });
    pcts.forEach(el  => { el.textContent = accuracy + '%'; });
    lvls.forEach(el  => { el.textContent = `Nivel ${level}`; });
  },

  _renderAchievements() {
    const s = NLState.student;
    const grid = document.querySelector('.achievement-grid');
    if (!grid) return;
    grid.innerHTML = NLState.achievementsCatalog.map(a => {
      const unlocked = s.achievements.includes(a.id);
      return `<div class="achievement ${unlocked ? 'unlocked' : 'locked'}"
        onclick="${unlocked
          ? `NLUI.showAchievement('${a.icon}','${a.name}','${a.desc}')`
          : `NLUI.showLockedAchievement('${a.icon}','${a.name}','${a.desc}')`}">
        <span>${a.icon}</span>
        <div class="achievement-name">${a.name}</div>
      </div>`;
    }).join('');
  },

  _showPendingAchievements() {
    const pending = NLState.student.notifications.filter(n => n.type === 'achievement');
    if (!pending.length) return;
    pending.forEach((n, i) => {
      const a = NLState.getAchievement(n.achievementId);
      if (!a) return;
      setTimeout(() => {
        NLUI.showAchievementToast(a.icon, a.name, a.desc);
      }, i * 2500);
    });
    NLState.student.notifications = NLState.student.notifications.filter(n => n.type !== 'achievement');
    NLState._persist();
  },
};

// ============================================================
// EVALUACIÓN DIAGNÓSTICA
// ============================================================
const NLPageEval = {
  questions: [], current: 0, answers: [], timer: null, qStart: 0, selectedIdx: null,

  init() {
    console.log('[NLPageEval] init() called');
    
    // Verificar que NLAdaptive esté cargado
    if (typeof NLAdaptive === 'undefined') {
      console.error('[NLPageEval] ERROR: NLAdaptive no está cargado');
      setTimeout(() => this.init(), 500);
      return;
    }
    
    console.log('[NLPageEval] NLAdaptive ✅');
    
    // Mostrar intro solo si es primera vez
    const showIntro = !NLState.evaluation.active && !NLState.evaluation.completed;
    if (showIntro) {
      console.log('[NLPageEval] Mostrando intro de bienvenida');
      const intro = document.getElementById('diagnostic-intro');
      if (intro) {
        intro.style.display = 'flex';
        const startBtn = document.getElementById('start-diagnostic-btn');
        if (startBtn) {
          startBtn.onclick = () => {
            console.log('[NLPageEval] Botón Start clicked');
            intro.style.display = 'none';
            NLState.evaluation.active = true;
            setTimeout(() => this.init(), 100);
          };
        }
        return;
      }
    }
    
    // Cargar preguntas
    console.log('[NLPageEval] Cargando preguntas...');
    try {
      this.questions = NLAdaptive.getDiagnosticQuestions();
    } catch(e) {
      console.error('[NLPageEval] Error al cargar preguntas:', e);
      alert('Error cargando preguntas: ' + e.message);
      return;
    }
    
    console.log('[NLPageEval] Preguntas cargadas:', this.questions.length);
    
    if (!this.questions || this.questions.length === 0) {
      console.error('[NLPageEval] ERROR: No hay preguntas');
      alert('Error: No se cargaron preguntas. Verifica la consola.');
      return;
    }
    
    console.log('[NLPageEval] Primera pregunta:', this.questions[0]?.q);
    
    this.current     = 0;
    this.answers     = [];
    this.selectedIdx = null;
    NLState.evaluation.active = true;
    
    console.log('[NLPageEval] Llamando _renderQuestion()');
    this._renderQuestion();
    this._startTimer();
  },

  _startTimer() {
    let secs = 600;
    const el = document.getElementById('clock');
    this.timer = setInterval(() => {
      secs = Math.max(0, secs - 1);
      if (el) el.textContent = `${Math.floor(secs/60).toString().padStart(2,'0')}:${(secs%60).toString().padStart(2,'0')}`;
      if (secs === 0) { clearInterval(this.timer); this._finish(); }
    }, 1000);
  },

  _renderQuestion() {
    console.log('[_renderQuestion] current:', this.current);
    const q     = this.questions[this.current];
    console.log('[_renderQuestion] question:', q);
    const total = this.questions.length;
    if (!q) { console.log('[_renderQuestion] No question! Finishing.'); this._finish(); return; }
    console.log('[_renderQuestion] Rendering:', q.q);

    this.qStart      = Date.now();
    this.selectedIdx = null;

    // Progress
    const pct = Math.round((this.current / total) * 100);
    _setAll('#q-label', `Pregunta ${this.current + 1} de ${total}`);
    _setAll('#q-pct',   `${pct}% completado`);
    const fill = document.getElementById('prog-fill');
    if (fill) fill.style.width = pct + '%';

    // Stepper
    this._updateStepper();

    // Chip de materia
    const isSpanish = this.current >= 6;
    const chip = document.getElementById('q-chip');
    if (chip) {
      chip.textContent      = isSpanish ? '📚 Español' : '🔢 Matemáticas';
      chip.style.background = isSpanish ? 'rgba(236,72,153,0.1)' : 'rgba(124,58,237,0.1)';
      chip.style.color      = isSpanish ? '#EC4899' : '#7C3AED';
    }

    // Dificultad
    const diffLabel = document.getElementById('diff-label');
    const diffDot   = document.getElementById('diff-dot');
    const diffMap   = { easy:'Nivel fácil', medium:'Nivel medio', hard:'Nivel difícil' };
    if (diffLabel) diffLabel.textContent = diffMap[q.difficulty || 'easy'];
    if (diffDot)   diffDot.className     = `diff-dot ${q.difficulty || 'easy'}`;

    // Botones
    const confirmBtn = document.getElementById('confirm-btn');
    if (confirmBtn) { confirmBtn.disabled = true; confirmBtn.textContent = 'Comprobar ✓'; confirmBtn.onclick = () => this._confirm(); }
    const skipBtn = document.getElementById('skip-btn');
    if (skipBtn) skipBtn.onclick = () => this._skip();

    // Render según tipo
    if (q.type === 'image') this._renderImage(q);
    else                    this._renderMCQ(q);

    // Scroll suave al inicio de la tarjeta
    const card = document.getElementById('question-card');
    if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
  },

  _renderMCQ(q) {
    console.log('[_renderMCQ] called with q:', q.q);
    const mcqWrap = document.getElementById('mcq-options');
    const imgWrap = document.getElementById('image-options');
    console.log('[_renderMCQ] mcqWrap:', mcqWrap, 'imgWrap:', imgWrap);
    if (!mcqWrap) { console.error('[_renderMCQ] ERROR: mcq-options not found'); return; }
    mcqWrap.style.display = '';
    if (imgWrap) imgWrap.style.display = 'none';

    // Texto
    const qtxt = document.getElementById('q-text');
    if (qtxt) {
      const match = q.q.match(/\d[\d\s+\-]+\d|\d/);
      const hi    = match ? match[0].trim() : '';
      qtxt.innerHTML = hi
        ? q.q.replace(hi, `<span class="q-highlight">${hi}</span>`)
        : q.q;
    }

    // Opciones
    const letters = ['A','B','C','D'];
    q.opts.forEach((opt, i) => {
      const el = document.getElementById(`opt-${i}`);
      if (!el) return;
      el.className = 'mcq-option';
      el.innerHTML = `<div class="mcq-letter">${letters[i]}</div><span>${opt}</span>`;
      el.onclick = () => {
        q.opts.forEach((_, j) => {
          const o = document.getElementById(`opt-${j}`);
          if (o) o.className = 'mcq-option';
        });
        el.className = 'mcq-option selected';
        this.selectedIdx = i;
        const btn = document.getElementById('confirm-btn');
        if (btn) btn.disabled = false;
      };
    });
  },

  _renderImage(q) {
    const mcqWrap = document.getElementById('mcq-options');
    const imgWrap = document.getElementById('image-options');
    if (!imgWrap) { console.error('image-options not found'); return; }
    if (mcqWrap) mcqWrap.style.display = 'none';
    imgWrap.style.display = '';

    const qtxt = document.getElementById('q-text');
    if (qtxt) qtxt.innerHTML = q.q.replace(/"([^"]+)"/, '<span class="q-highlight" style="color:#EC4899">"$1"</span>');

    q.opts.forEach((opt, i) => {
      const el = document.getElementById(`img-${i}`);
      if (!el) return;
      el.className = 'image-choice';
      el.innerHTML = `<span class="image-emoji">${opt.e}</span><div class="image-label">${opt.l}</div>`;
      el.onclick = () => {
        q.opts.forEach((_, j) => {
          const o = document.getElementById(`img-${j}`);
          if (o) o.className = 'image-choice';
        });
        el.className = 'image-choice selected';
        this.selectedIdx = i;
        const btn = document.getElementById('confirm-btn');
        if (btn) btn.disabled = false;
      };
    });
  },

  _confirm() {
    if (this.selectedIdx === null) return;
    const q    = this.questions[this.current];
    const ok   = this.selectedIdx === q.ans;
    const time = parseFloat(((Date.now() - this.qStart) / 1000).toFixed(1));

    // Guardar respuesta (solo una vez aquí)
    this.answers.push({ ok, time, topic: q.topic || 'general', qIdx: this.current });

    // Feedback visual
    if (q.type === 'image') {
      q.opts.forEach((_, i) => {
        const el = document.getElementById(`img-${i}`);
        if (!el) return;
        el.onclick = null;
        if (i === q.ans)                              el.classList.add('correct');
        else if (i === this.selectedIdx && !ok)       el.classList.add('wrong');
      });
    } else {
      q.opts.forEach((_, i) => {
        const el = document.getElementById(`opt-${i}`);
        if (!el) return;
        el.onclick  = null;
        el.className = 'mcq-option' + (i === q.ans ? ' correct' : (i === this.selectedIdx && !ok ? ' wrong' : ''));
      });
    }

    // Bloquear botones
    const confirmBtn = document.getElementById('confirm-btn');
    if (confirmBtn) { confirmBtn.disabled = true; confirmBtn.onclick = null; }
    const skipBtn = document.getElementById('skip-btn');
    if (skipBtn) skipBtn.onclick = null;

    this._showToast(ok);

    setTimeout(() => {
      this.current++;
      if (this.current >= this.questions.length) this._finish();
      else this._renderQuestion();
    }, 1400);
  },

  _skip() {
    this.answers.push({ ok: false, time: 0, topic: this.questions[this.current]?.topic || 'general', skipped: true });
    this.current++;
    if (this.current >= this.questions.length) this._finish();
    else this._renderQuestion();
  },

  _updateStepper() {
    const section = Math.floor(this.current / 2);
    const steps   = document.querySelectorAll('.step-item');
    steps.forEach((item, i) => {
      const circle = item.querySelector('.step-circle');
      item.classList.remove('active','done','pending');
      if (circle) circle.classList.remove('active','done','pending');

      if (i < section) {
        item.classList.add('done');
        if (circle) { circle.classList.add('done'); circle.textContent = '✓'; }
      } else if (i === section) {
        item.classList.add('active');
        if (circle) { circle.classList.add('active'); circle.textContent = String(i + 1); }
      } else {
        item.classList.add('pending');
        if (circle) { circle.classList.add('pending'); circle.textContent = String(i + 1); }
      }
    });

    // Actualizar section-intro
    const isSpanish  = this.current >= 6;
    const sectionNum = section + 1;
    const badge = document.getElementById('section-badge');
    const title = document.getElementById('section-title');
    const sectionTitles = ['Conteo','Sumas','Restas','Sílabas','Vocabulario','Comprensión'];
    const subjectNames  = isSpanish ? '📚 Español' : '🔢 Matemáticas';
    if (badge) badge.textContent = `${subjectNames} — Sección ${sectionNum} de 6`;
    if (title) title.textContent = sectionTitles[section] || `Sección ${sectionNum}`;
  },

  _showToast(ok) {
    const t = document.getElementById('toast'); if (!t) return;
    t.className = ok ? 'toast show' : 'toast wrong-toast show';
    const icon  = document.getElementById('toast-icon');  if (icon)  icon.textContent  = ok ? '🎉' : '💪';
    const title = document.getElementById('toast-title'); if (title) title.textContent = ok ? '¡Excelente!' : '¡Casi!';
    const msg   = document.getElementById('toast-msg');   if (msg)   msg.textContent   = ok ? 'Respuesta correcta. ¡Sigue así!' : 'No te preocupes, sigue practicando.';
    setTimeout(() => t.classList.remove('show'), 1300);
  },

  _finish() {
    clearInterval(this.timer);
    const mathAns = this.answers.slice(0, 6);
    const spanAns = this.answers.slice(6);
    const mathAcc = mathAns.length ? Math.round(mathAns.filter(a => a.ok).length / mathAns.length * 100) : 0;
    const spanAcc = spanAns.length ? Math.round(spanAns.filter(a => a.ok).length / spanAns.length * 100) : 0;
    const times   = this.answers.filter(a => a.time > 0).map(a => a.time);
    const avgTime = times.length ? parseFloat((times.reduce((s,t) => s + t, 0) / times.length).toFixed(1)) : 0;

    NLState.student.subjects.math.accuracy                = mathAcc;
    NLState.student.subjects.spanish.accuracy             = spanAcc;
    NLState.student.subjects.math.currentDifficulty       = mathAcc >= 75 ? 'medium' : 'easy';
    NLState.student.subjects.spanish.currentDifficulty    = spanAcc >= 75 ? 'medium' : 'easy';
    NLState.evaluation.completed = true;
    NLState.evaluation.score     = { math: mathAcc, spanish: spanAcc };
    NLState._persist();

    document.body.innerHTML = `
      <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">
      <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#667eea,#764ba2);font-family:'DM Sans',sans-serif;padding:1rem;">
        <div style="background:white;border-radius:2rem;padding:2.5rem;max-width:520px;width:100%;text-align:center;box-shadow:0 30px 60px rgba(0,0,0,0.2);">
          <div style="font-size:4rem;margin-bottom:1rem;">🎉</div>
          <h1 style="font-family:'Fredoka',sans-serif;font-size:2.25rem;margin-bottom:0.4rem;">¡Evaluación Completa!</h1>
          <p style="color:#64748B;margin-bottom:2rem;font-size:0.95rem;">Respondiste ${this.answers.length} de ${this.questions.length} preguntas</p>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem;">
            <div style="background:#F8FAFC;border-radius:1.25rem;padding:1.5rem;">
              <div style="font-size:2rem;margin-bottom:0.4rem;">🔢</div>
              <div style="font-family:'Fredoka',sans-serif;font-size:2rem;color:#7C3AED;font-weight:700;">${mathAcc}%</div>
              <div style="font-size:0.8rem;color:#64748B;">Matemáticas</div>
              <div style="margin-top:0.5rem;height:6px;background:#E2E8F0;border-radius:999px;overflow:hidden;">
                <div style="height:100%;width:${mathAcc}%;background:linear-gradient(90deg,#667eea,#764ba2);border-radius:999px;transition:width 1.2s;"></div>
              </div>
            </div>
            <div style="background:#F8FAFC;border-radius:1.25rem;padding:1.5rem;">
              <div style="font-size:2rem;margin-bottom:0.4rem;">📚</div>
              <div style="font-family:'Fredoka',sans-serif;font-size:2rem;color:#EC4899;font-weight:700;">${spanAcc}%</div>
              <div style="font-size:0.8rem;color:#64748B;">Español</div>
              <div style="margin-top:0.5rem;height:6px;background:#E2E8F0;border-radius:999px;overflow:hidden;">
                <div style="height:100%;width:${spanAcc}%;background:linear-gradient(90deg,#f093fb,#f5576c);border-radius:999px;transition:width 1.2s;"></div>
              </div>
            </div>
          </div>
          <div style="background:#F0FDF4;border:1px solid #86EFAC;border-radius:1rem;padding:0.875rem;margin-bottom:1.5rem;font-size:0.82rem;color:#166534;text-align:left;line-height:1.7;">
            ⏱ Tiempo promedio: <strong>${avgTime}s</strong> &nbsp;·&nbsp; 🎯 Nivel inicial ajustado automáticamente
          </div>
          <button onclick="window.location.href='student-dashboard.html'"
            style="width:100%;padding:1.1rem;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:999px;font-family:'Fredoka',sans-serif;font-size:1.1rem;font-weight:600;cursor:pointer;box-shadow:0 8px 20px rgba(102,126,234,0.3);">
            🚀 ¡Comenzar a Aprender!
          </button>
        </div>
      </div>`;
  },
};

// ============================================================
// EJERCICIOS ADAPTATIVOS
// ============================================================
const NLPageExercise = {
  subject: 'math', difficulty: 'easy',
  question: null, usedIds: [],
  qCount: 0, total: 10, score: 0,
  timer: null, qStart: 0, selected: null,
  sessionLog: [],  // {correct, time, topic, diff}

  init() {
    if (!NLState.session.isLoggedIn) { window.location.href = 'login-register.html'; return; }
    this.subject    = NLState.exercise.subject    || 'math';
    this.difficulty = NLState.student.subjects[this.subject]?.currentDifficulty || 'easy';
    this.usedIds    = [];
    this.qCount     = 0;
    this.score      = 0;
    this.sessionLog = [];
    NLState.exercise.consecutiveErrors  = 0;
    NLState.exercise.consecutiveCorrect = 0;
    this._load();
    this._startTimer();
  },

  _startTimer() {
    let secs = 105;
    const el = document.getElementById('timer');
    this.timer = setInterval(() => {
      secs--;
      const m = Math.floor(secs/60), s = (secs%60).toString().padStart(2,'0');
      if (el) el.textContent = `${m}:${s}`;
      if (secs <= 0) { clearInterval(this.timer); this.skip(); }
    }, 1000);
  },

  _load() {
    const q = NLAdaptive.getNextQuestion(this.subject, this.difficulty, this.usedIds);
    if (!q) { this._finish(); return; }
    this.question = q;
    this.usedIds.push(q.id);
    this.selected = null;
    this.qStart   = Date.now();

    // Progress UI
    const num = document.querySelector('.exercise-number');
    if (num) num.textContent = `Ejercicio ${this.qCount+1} de ${this.total}`;
    const fill = document.querySelector('.progress-bar-fill, .progress-fill');
    if (fill) fill.style.width = `${(this.qCount/this.total)*100}%`;
    const badge = document.querySelector('.subject-badge, .exercise-subject');
    if (badge) badge.textContent = this.subject === 'math' ? '🔢 Matemáticas' : '📚 Español';

    // Difficulty indicator
    const diffEl = document.querySelector('.difficulty-badge, .q-difficulty');
    const diffMap = { easy:'🟢 Fácil', medium:'🟡 Medio', hard:'🔴 Difícil' };
    if (diffEl) diffEl.textContent = diffMap[this.difficulty] || '';

    // Render question
    if (q.type === 'image') this._renderImage(q);
    else this._renderMCQ(q);

    const checkBtn = document.getElementById('checkBtn');
    if (checkBtn) { checkBtn.disabled = true; checkBtn.onclick = () => this.check(); }
  },

  _renderMCQ(q) {
    const qtxt = document.querySelector('.question-text');
    if (qtxt) {
      const hi = q.q.match(/[\d\s+\-]+(?=[?])/)?.[0] || q.q;
      qtxt.innerHTML = q.q.replace(hi.trim(), `<span class="question-highlight">${hi.trim()}</span>`);
    }
    const opts = document.querySelectorAll('.answer-option');
    opts.forEach((opt, i) => {
      opt.className = 'answer-option';
      const labels = ['A','B','C','D'];
      opt.innerHTML = `<div class="answer-letter">${labels[i]}</div><span>${q.opts[i] ?? ''}</span>`;
      opt.onclick = () => {
        opts.forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        this.selected = i;
        const btn = document.getElementById('checkBtn');
        if (btn) btn.disabled = false;
      };
    });
  },

  _renderImage(q) {
    const qtxt = document.querySelector('.question-text');
    if (qtxt) qtxt.innerHTML = q.q.replace(/"([^"]+)"/, '<span class="question-highlight">"$1"</span>');
    const opts = document.querySelectorAll('.answer-option');
    opts.forEach((opt, i) => {
      opt.className = 'answer-option';
      const o = q.opts[i];
      opt.innerHTML = o ? `<span style="font-size:2rem;display:block;margin-bottom:0.4rem">${o.e}</span><span>${o.l}</span>` : '';
      opt.onclick = () => {
        opts.forEach(ob => ob.classList.remove('selected'));
        opt.classList.add('selected');
        this.selected = i;
        const btn = document.getElementById('checkBtn');
        if (btn) btn.disabled = false;
      };
    });
  },

  check() {
    if (this.selected === null) return;
    const q    = this.question;
    const ok   = this.selected === q.ans;
    const time = parseFloat(((Date.now() - this.qStart)/1000).toFixed(1));

    // Mostrar visual
    const opts = document.querySelectorAll('.answer-option');
    opts.forEach((o, i) => {
      o.classList.remove('selected');
      if (i === q.ans)                            o.classList.add('correct');
      else if (i === this.selected && !ok)        o.classList.add('wrong');
    });

    // Registrar en state
    const result = NLState.recordAnswer(this.subject, ok, time, q.topic || 'general', this.difficulty);
    if (ok) this.score++;
    this.sessionLog.push({ ok, time, topic: q.topic, diff: this.difficulty });

    // Ajustar dificultad
    const adj = NLAdaptive.adjustDifficulty(this.difficulty, {
      consecutiveErrors:  NLState.exercise.consecutiveErrors,
      consecutiveCorrect: NLState.exercise.consecutiveCorrect,
      accuracy: NLState.student.subjects[this.subject].accuracy,
    });
    if (adj.changed) {
      this.difficulty = adj.level;
      NLState.student.subjects[this.subject].currentDifficulty = adj.level;
      const dirMsg = adj.direction === 'up' ? '🚀 ¡Subiste de nivel!' : '💡 Bajando un poco la dificultad';
      setTimeout(() => NLRouter._showToast(dirMsg, adj.direction==='up'?'success':'info'), 200);
    }

    // Feedback
    this._showFeedback(ok, q.opts[q.ans], result.pts);

    // Logros nuevos
    result.newAchievements.forEach((a, i) => {
      setTimeout(() => NLUI.showAchievementToast(a.icon, a.name, a.desc), 1800 + i*2500);
    });

    const btn = document.getElementById('checkBtn');
    if (btn) btn.disabled = true;

    this.qCount++;
    setTimeout(() => {
      if (this.qCount >= this.total) this._finish();
      else this._load();
    }, 1800);
  },

  skip() {
    this.qCount++;
    if (this.qCount >= this.total) this._finish();
    else this._load();
  },

  _showFeedback(ok, correctAnswer, pts) {
    const msgs = {
      ok:   ['¡Excelente! 🌟', '¡Perfecto! 💯', '¡Correcto! 🎯', '¡Brillante! ✨', '¡Genial! 🚀'],
      bad:  [`La respuesta era "${correctAnswer}". ¡Tú puedes! 💪`, `Era "${correctAnswer}". ¡Sigue intentando! 📖`],
    };
    const pool = ok ? msgs.ok : msgs.bad;
    const msg  = pool[Math.floor(Math.random()*pool.length)];
    const el   = document.querySelector('.encouragement-text, .encouragement p');
    if (el) el.textContent = ok ? `${msg}  +${pts} pts ⭐` : msg;

    // Actualizar puntos en la UI en tiempo real
    const ptsEl = document.querySelector('.live-points');
    if (ptsEl) ptsEl.textContent = `⭐ ${NLState.student.points.toLocaleString()} pts`;
  },

  _finish() {
    clearInterval(this.timer);
    const pct = this.total > 0 ? Math.round((this.score/this.total)*100) : 0;
    const pts = this.sessionLog.reduce((s,a) => s + (a.ok ? (a.diff==='hard'?20:a.diff==='medium'?15:10) : 0), 0);
    const avgT= this.sessionLog.length ? parseFloat((this.sessionLog.reduce((s,a)=>s+a.time,0)/this.sessionLog.length).toFixed(1)) : 0;

    // Recomendaciones
    const rd = NLState.buildReportData();
    const recHTML = rd.recs.map(r =>
      `<div style="background:#F8FAFC;border-radius:1rem;padding:1rem;display:flex;gap:0.75rem;margin-bottom:0.75rem;text-align:left;">
        <span style="font-size:1.5rem;">${r.icon}</span>
        <div><div style="font-weight:700;font-size:0.9rem;">${r.title}</div><div style="font-size:0.8rem;color:#64748B;margin-top:0.2rem;">${r.text}</div></div>
       </div>`
    ).join('');

    document.body.style.background = 'linear-gradient(135deg,#667eea,#764ba2)';
    document.body.innerHTML = `
      <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">
      <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:1.5rem;font-family:'DM Sans',sans-serif;">
        <div style="background:white;border-radius:2rem;padding:2.5rem;max-width:520px;width:100%;box-shadow:0 30px 60px rgba(0,0,0,0.2);">
          <div style="text-align:center;margin-bottom:1.5rem;">
            <div style="font-size:4rem;margin-bottom:0.75rem;">${pct>=80?'🏆':pct>=60?'💪':'📖'}</div>
            <h1 style="font-family:'Fredoka',sans-serif;font-size:2rem;margin-bottom:0.3rem;">¡Sesión Completada!</h1>
            <p style="color:#64748B;font-size:0.9rem;">${this.score} de ${this.total} respuestas correctas</p>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.75rem;margin-bottom:1.5rem;text-align:center;">
            <div style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;border-radius:1.25rem;padding:1.25rem;">
              <div style="font-family:'Fredoka',sans-serif;font-size:2rem;font-weight:700;">${pct}%</div>
              <div style="font-size:0.75rem;opacity:0.9;">Precisión</div>
            </div>
            <div style="background:#F1F5F9;border-radius:1.25rem;padding:1.25rem;">
              <div style="font-family:'Fredoka',sans-serif;font-size:2rem;font-weight:700;color:#F59E0B;">+${pts}</div>
              <div style="font-size:0.75rem;color:#64748B;">Puntos ⭐</div>
            </div>
            <div style="background:#F1F5F9;border-radius:1.25rem;padding:1.25rem;">
              <div style="font-family:'Fredoka',sans-serif;font-size:2rem;font-weight:700;color:#06B6D4;">${avgT}s</div>
              <div style="font-size:0.75rem;color:#64748B;">Promedio</div>
            </div>
          </div>
          ${rd.recs.length ? `<div style="margin-bottom:1.5rem;"><div style="font-family:'Fredoka',sans-serif;font-size:1.1rem;margin-bottom:0.75rem;">💡 Recomendaciones</div>${recHTML}</div>` : ''}
          <div style="display:flex;gap:0.75rem;">
            <button onclick="NLState.exercise.consecutiveErrors=0;NLState.exercise.consecutiveCorrect=0;window.location.reload();"
              style="flex:1;padding:1rem;background:#F1F5F9;border:none;border-radius:999px;font-family:'Fredoka',sans-serif;font-size:1rem;font-weight:600;cursor:pointer;">
              🔄 Otra ronda
            </button>
            <button onclick="window.location.href='student-dashboard.html'"
              style="flex:1;padding:1rem;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:999px;font-family:'Fredoka',sans-serif;font-size:1rem;font-weight:600;cursor:pointer;box-shadow:0 5px 15px rgba(102,126,234,0.3);">
              🏠 Mi Panel
            </button>
          </div>
        </div>
      </div>`;
  },
};

// ============================================================
// TEACHER DASHBOARD
// ============================================================
const NLPageTeacher = {
  init() {
    if (!NLState.session.isLoggedIn || NLState.session.role !== 'teacher') {
      window.location.href = 'login-register.html'; return;
    }
    this._renderStudentTable();
    this._renderMetrics();
  },

  _renderMetrics() {
    const students = NLState.teacher.students;
    const avgAcc   = Math.round(students.reduce((s,st)=>s+((st.mathAcc+st.spanishAcc)/2),0) / students.length);
    const totalSes = students.reduce((s,st)=>s+st.sessions,0);
    const highRisk = students.filter(st=>st.risk==='alto').length;

    _setAll('.metric-avg-acc',    avgAcc + '%');
    _setAll('.metric-sessions',   totalSes.toString());
    _setAll('.metric-risk-count', highRisk.toString());
    _setAll('.metric-students',   students.length.toString());
  },

  _renderStudentTable() {
    const tbody = document.querySelector('.student-table tbody, #student-tbody');
    if (!tbody) return;
    tbody.innerHTML = NLState.teacher.students.map(st => {
      const avg = Math.round((st.mathAcc + st.spanishAcc) / 2);
      const riskColor = st.risk==='alto'?'#EF4444':st.risk==='medio'?'#F59E0B':'#10B981';
      const riskBg    = st.risk==='alto'?'rgba(239,68,68,0.1)':st.risk==='medio'?'rgba(245,158,11,0.1)':'rgba(16,185,129,0.1)';
      return `<tr>
        <td style="font-weight:600;">${st.name}</td>
        <td>
          <div style="display:flex;align-items:center;gap:0.5rem;">
            <div style="flex:1;height:6px;background:#E2E8F0;border-radius:999px;overflow:hidden;min-width:60px;">
              <div style="height:100%;width:${st.mathAcc}%;background:linear-gradient(90deg,#667eea,#764ba2);border-radius:999px;"></div>
            </div>
            <span style="font-size:0.8rem;font-weight:600;min-width:30px;">${st.mathAcc}%</span>
          </div>
        </td>
        <td>
          <div style="display:flex;align-items:center;gap:0.5rem;">
            <div style="flex:1;height:6px;background:#E2E8F0;border-radius:999px;overflow:hidden;min-width:60px;">
              <div style="height:100%;width:${st.spanishAcc}%;background:linear-gradient(90deg,#f093fb,#f5576c);border-radius:999px;"></div>
            </div>
            <span style="font-size:0.8rem;font-weight:600;min-width:30px;">${st.spanishAcc}%</span>
          </div>
        </td>
        <td><span style="font-size:0.85rem;">${st.streak}🔥 días</span></td>
        <td><span class="risk-badge" style="padding:0.3rem 0.75rem;border-radius:999px;font-size:0.78rem;font-weight:700;background:${riskBg};color:${riskColor};">${st.risk.charAt(0).toUpperCase()+st.risk.slice(1)}</span></td>
        <td><button class="action-btn" onclick="window.location.href='progress-report.html'" style="padding:0.4rem 1rem;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:999px;font-size:0.8rem;cursor:pointer;font-weight:600;">Ver</button></td>
      </tr>`;
    }).join('');
  },

  filterTable(subject, btn) {
    document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    const rows = document.querySelectorAll('.student-table tbody tr, #student-tbody tr');
    rows.forEach(row => {
      if (subject === 'all') { row.style.display = ''; return; }
      const risk = row.querySelector('.risk-badge')?.textContent?.toLowerCase() || '';
      const show = subject === 'math' ? (risk==='alto'||risk==='medio') : (risk==='bajo');
      row.style.display = show ? '' : 'none';
    });
  },
};

// ============================================================
// PARENT DASHBOARD
// ============================================================
const NLPageParent = {
  init() {
    if (!NLState.session.isLoggedIn || NLState.session.role !== 'parent') {
      window.location.href = 'login-register.html'; return;
    }
    this._renderData();
  },

  _renderData() {
    const s  = NLState.student;
    const m  = s.subjects.math;
    const sp = s.subjects.spanish;
    const rd = NLState.buildReportData();

    _setAll('.child-name-display', s.name + ' ' + s.lastName);
    _setAll('.parent-avg-acc', Math.round((m.accuracy + sp.accuracy)/2) + '%');
    _setAll('.parent-streak', s.streakDays + ' días');
    _setAll('.parent-points', s.points.toLocaleString());
    _setAll('.parent-math-acc', m.accuracy + '%');
    _setAll('.parent-spanish-acc', sp.accuracy + '%');
    _setAll('.parent-risk-level', rd.risk.label || '—');

    // Mini barras
    document.querySelectorAll('.parent-math-bar').forEach(el => el.style.width = m.accuracy + '%');
    document.querySelectorAll('.parent-spanish-bar').forEach(el => el.style.width = sp.accuracy + '%');
  },
};

// ============================================================
// PROGRESS REPORT
// ============================================================
const NLPageReport = {
  init() {
    if (!NLState.session.isLoggedIn) { window.location.href='login-register.html'; return; }
    this._renderReport();
    this._addBackBtn();
  },

  _addBackBtn() {
    const b = document.createElement('button');
    b.innerHTML = '← Volver';
    b.style.cssText = 'position:fixed;top:1.5rem;left:1.5rem;padding:0.75rem 1.5rem;background:white;border:none;border-radius:999px;font-family:"Fredoka",sans-serif;font-weight:600;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.1);z-index:100;';
    b.onclick = () => window.history.back();
    document.body.appendChild(b);
  },

  _renderReport() {
    const rd = NLState.buildReportData();
    const s  = rd.student;
    const m  = rd.math;
    const sp = rd.spanish;

    // Header
    _setAll('.rh-name',    `${s.name} ${s.lastName}`);
    _setAll('.rh-meta',    `${s.grade} · ${s.school}`);

    // Métricas header
    _setAll('.report-avg-acc',  Math.round((m.accuracy+sp.accuracy)/2) + '%');
    _setAll('.report-total-ex', (m.totalAnswered + sp.totalAnswered).toString());
    _setAll('.report-streak',   s.streakDays + ' días');
    _setAll('.report-avg-time', Math.max(m.avgTime, sp.avgTime) + 's');

    // Riesgo
    const riskCircle = document.querySelector('.risk-circle');
    if (riskCircle) {
      riskCircle.className = `risk-circle ${rd.risk.level}`;
      riskCircle.innerHTML = `<div class="risk-val ${rd.risk.level}">${rd.risk.label || rd.risk.level.charAt(0).toUpperCase()+rd.risk.level.slice(1)}</div><div class="risk-lbl">Riesgo</div>`;
    }
    const riskBody = document.querySelector('.risk-body p');
    if (riskBody) {
      if (rd.risk.level === 'bajo') {
        riskBody.textContent = 'El sistema no detecta señales de riesgo. El alumno mantiene un desempeño consistente. Se recomienda continuar con el ritmo actual.';
      } else {
        riskBody.textContent = 'Se detectaron las siguientes señales de atención: ' + rd.risk.reasons.join('. ') + '.';
      }
    }

    // Barras de precisión
    this._renderAccBar('.math-acc-bar',    m.accuracy,  '#667eea');
    this._renderAccBar('.spanish-acc-bar', sp.accuracy, '#f093fb');

    // Gráficas radiales (actualizar el texto)
    _setAll('.radial-math-val', m.accuracy + '%');
    _setAll('.radial-esp-val',  sp.accuracy + '%');

    // Patrones de error
    this._renderErrorPatterns(rd);

    // Recomendaciones
    this._renderRecommendations(rd.recs);
  },

  _renderAccBar(sel, pct, color) {
    const el = document.querySelector(sel);
    if (el) { el.style.width = pct + '%'; el.style.background = `linear-gradient(90deg,${color},${color}88)`; }
  },

  _renderErrorPatterns(rd) {
    const container = document.querySelector('.error-grid');
    if (!container) return;
    const errorMap = {};
    [...rd.math.errorLog, ...rd.spanish.errorLog].forEach(e => {
      errorMap[e.topic] = (errorMap[e.topic]||0) + 1;
    });
    const sorted = Object.entries(errorMap).sort((a,b)=>b[1]-a[1]).slice(0,4);
    const total  = Object.values(errorMap).reduce((s,v)=>s+v,0) || 1;
    const icons  = { restas:'➖', sumas:'➕', comprension:'📖', silabas:'🔤', vocabulario:'📝', gramatica:'✍️', letras:'🔡' };
    if (sorted.length === 0) {
      container.innerHTML = '<div style="text-align:center;color:#64748B;padding:1.5rem;">✅ Sin errores registrados aún. ¡Sigue así!</div>';
      return;
    }
    container.innerHTML = sorted.map(([topic, count]) => {
      const pct = Math.round((count/total)*100);
      const lvl = pct >= 60 ? 'high' : pct >= 35 ? 'med' : 'low';
      const clr = lvl==='high'?'#EF4444':lvl==='med'?'#F59E0B':'#10B981';
      return `<div class="error-row">
        <div class="error-icon">${icons[topic]||'❓'}</div>
        <div class="error-info">
          <div class="error-name">${topic.charAt(0).toUpperCase()+topic.slice(1)}</div>
          <div class="error-desc">${count} error${count!==1?'es':''} registrado${count!==1?'s':''}</div>
        </div>
        <div class="error-bar-wrap">
          <div class="error-count" style="color:${clr}">${count} errores</div>
          <div class="e-bar"><div class="e-fill ${lvl}" style="width:${pct}%;background:${clr};height:100%;border-radius:999px;"></div></div>
        </div>
      </div>`;
    }).join('');
  },

  _renderRecommendations(recs) {
    const grid = document.querySelector('.rec-grid');
    if (!grid || !recs.length) return;
    grid.innerHTML = recs.map(r => `
      <div class="rec-item" style="cursor:pointer" onclick="${r.action ? `NLState.exercise.subject='${r.action}';NLState.exercise.difficulty='${r.diff||'easy'}';window.location.href='exercise-interface.html'` : `NLUI.showModal('${r.icon} ${r.title}','${r.text}')`}">
        <div class="rec-ico">${r.icon}</div>
        <div class="rec-title">${r.title}</div>
        <div class="rec-text">${r.text}</div>
        ${r.tag ? `<div style="margin-top:0.75rem;display:inline-block;padding:0.25rem 0.75rem;background:rgba(0,0,0,0.07);border-radius:999px;font-size:0.75rem;font-weight:600;">${r.tag}</div>` : ''}
      </div>`).join('');
  },
};

// ── Helpers globales ────────────────────────────────────────
function _setText(sel, txt) { const e=document.querySelector(sel); if(e) e.textContent=txt; }
function _setAll(sel, txt)  { document.querySelectorAll(sel).forEach(e=>e.textContent=txt); }
function _injectKeyframes() {
  if (document.getElementById('nl-kf')) return;
  const s = document.createElement('style'); s.id='nl-kf';
  s.textContent='@keyframes nlFadeIn{from{opacity:0}to{opacity:1}}@keyframes nlSlideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}';
  document.head.appendChild(s);
}
// Aliases para compatibilidad con handlers inline del HTML
function selectAnswer(el) { NLPageExercise && (document.querySelectorAll('.answer-option').forEach(o=>o.classList.remove('selected')), el.classList.add('selected'), NLPageExercise.selected=Array.from(document.querySelectorAll('.answer-option')).indexOf(el), document.getElementById('checkBtn')&&(document.getElementById('checkBtn').disabled=false)); }
function selectMCQ(el) { if(window.NLPageEval&&NLPageEval.question) return; document.querySelectorAll('.mcq-option').forEach(o=>o.classList.remove('selected')); el.classList.add('selected'); }
function selectImage(el) { if(window.NLPageEval&&NLPageEval.question) return; document.querySelectorAll('.image-choice').forEach(o=>o.classList.remove('selected')); el.classList.add('selected'); }
function checkAnswer() {}
function checkImage()  {}
function placeSyllable(el,syl) { const b=document.querySelectorAll('.syllable-blank'),i=Array.from(b).findIndex(x=>!x.classList.contains('filled')); if(i>=0){b[i].textContent=syl;b[i].classList.add('filled');el.style.opacity='0.3';el.style.pointerEvents='none';} }

// ============================================================
// ARRANQUE — Simplificado sin loops
// ============================================================
(function startApp() {
  console.log("[startApp] Iniciando app para:", _page);
  
  // Dar un momento para que los scripts defer terminen
  setTimeout(function() {
    // Fade-in
    document.body.style.opacity = "0";
    document.body.style.transition = "opacity 0.35s ease";
    setTimeout(function() { document.body.style.opacity = "1"; }, 30);

    var map = {
      "landing-page":          NLPageLanding,
      "login-register":        NLPageLogin,
      "student-dashboard":     NLPageStudent,
      "diagnostic-evaluation": NLPageEval,
      "exercise-interface":    NLPageExercise,
      "teacher-dashboard":     NLPageTeacher,
      "parent-dashboard":      NLPageParent,
      "progress-report":       NLPageReport
    };
    
    var pageObj = map[_page];
    if (pageObj && typeof pageObj.init === "function") {
      console.log("[startApp] Llamando a", _page, ".init()");
      pageObj.init();
    } else {
      console.warn("[startApp] No se encontró init para:", _page);
    }
  }, 200);
})();