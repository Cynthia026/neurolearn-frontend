// ============================================================
// demo-video.js — Sistema de Demo Interactivo NeuroLearn
// Simula las 3 interfaces: Alumno, Docente, Padre
// ============================================================

const NLDemo = {
  currentRole: 'student',
  playing: false,
  
  open() {
    const modal = this._createModal();
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
    this.play('student');
  },

  close() {
    const modal = document.getElementById('nl-demo-modal');
    if (modal) {
      modal.classList.remove('show');
      setTimeout(() => modal.remove(), 300);
    }
    this.playing = false;
  },

  play(role) {
    this.currentRole = role;
    this.playing = true;
    
    // Update active tab
    document.querySelectorAll('.demo-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`[data-role="${role}"]`)?.classList.add('active');
    
    // Render demo screen
    const screen = document.getElementById('demo-screen');
    screen.innerHTML = this._getScreenContent(role);
    
    // Start animation sequence
    setTimeout(() => this._animateDemo(role), 500);
  },

  _createModal() {
    const modal = document.createElement('div');
    modal.id = 'nl-demo-modal';
    modal.className = 'demo-modal';
    modal.innerHTML = `
      <div class="demo-overlay" onclick="NLDemo.close()"></div>
      <div class="demo-container">
        <button class="demo-close" onclick="NLDemo.close()">×</button>
        
        <div class="demo-header">
          <h2>🎥 Demo Interactivo NeuroLearn Kids</h2>
          <p>Explora cómo funciona la plataforma para cada tipo de usuario</p>
        </div>

        <div class="demo-tabs">
          <button class="demo-tab active" data-role="student" onclick="NLDemo.play('student')">
            <span class="tab-icon">👦</span>
            <span class="tab-label">Alumno</span>
          </button>
          <button class="demo-tab" data-role="teacher" onclick="NLDemo.play('teacher')">
            <span class="tab-icon">👩‍🏫</span>
            <span class="tab-label">Docente</span>
          </button>
          <button class="demo-tab" data-role="parent" onclick="NLDemo.play('parent')">
            <span class="tab-icon">👪</span>
            <span class="tab-label">Padre/Madre</span>
          </button>
        </div>

        <div class="demo-screen-wrap">
          <div class="demo-screen" id="demo-screen"></div>
          <div class="demo-controls">
            <button onclick="NLDemo.play(NLDemo.currentRole)" class="demo-control-btn">
              🔄 Ver de nuevo
            </button>
          </div>
        </div>

        <div class="demo-footer">
          <button onclick="window.location.href='login-register.html'" class="btn-cta">
            ✨ Comenzar Gratis
          </button>
        </div>
      </div>
    `;
    
    // Inject styles
    if (!document.getElementById('demo-styles')) {
      const styles = document.createElement('style');
      styles.id = 'demo-styles';
      styles.textContent = this._getStyles();
      document.head.appendChild(styles);
    }
    
    return modal;
  },

  _getScreenContent(role) {
    const screens = {
      student: `
        <div class="demo-intro fade-in">
          <div class="demo-avatar">👦</div>
          <h3>Panel del Alumno</h3>
          <p>Aprende jugando con ejercicios adaptativos</p>
        </div>
        <div class="demo-feature slide-up delay-1" style="display:none">
          <div class="feature-card">
            <div class="feature-icon">🎯</div>
            <div class="feature-content">
              <h4>Ejercicios Adaptativos</h4>
              <p>El sistema ajusta la dificultad según tu desempeño en tiempo real</p>
              <div class="feature-visual">
                <div class="difficulty-bar">
                  <div class="diff-level easy">Fácil</div>
                  <div class="diff-level medium">Medio</div>
                  <div class="diff-level hard">Difícil</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="demo-feature slide-up delay-2" style="display:none">
          <div class="feature-card">
            <div class="feature-icon">🏆</div>
            <div class="feature-content">
              <h4>Sistema de Logros</h4>
              <p>Desbloquea insignias y sube de nivel mientras practicas</p>
              <div class="feature-visual">
                <div class="achievements-preview">
                  <div class="achievement unlock-anim">⭐</div>
                  <div class="achievement unlock-anim">🔥</div>
                  <div class="achievement unlock-anim">💎</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="demo-feature slide-up delay-3" style="display:none">
          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <div class="feature-content">
              <h4>Progreso en Tiempo Real</h4>
              <p>Visualiza tu avance en Matemáticas y Español con gráficas interactivas</p>
              <div class="feature-visual">
                <div class="progress-bars">
                  <div class="progress-item">
                    <span>Matemáticas</span>
                    <div class="bar"><div class="fill math-fill"></div></div>
                    <span class="pct">85%</span>
                  </div>
                  <div class="progress-item">
                    <span>Español</span>
                    <div class="bar"><div class="fill spanish-fill"></div></div>
                    <span class="pct">92%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `,
      
      teacher: `
        <div class="demo-intro fade-in">
          <div class="demo-avatar">👩‍🏫</div>
          <h3>Panel del Docente</h3>
          <p>Monitorea y apoya a tus estudiantes</p>
        </div>
        <div class="demo-feature slide-up delay-1" style="display:none">
          <div class="feature-card">
            <div class="feature-icon">📋</div>
            <div class="feature-content">
              <h4>Dashboard de Grupo</h4>
              <p>Visualiza el desempeño de todos tus alumnos en un solo lugar</p>
              <div class="feature-visual">
                <div class="student-table-preview">
                  <div class="table-row header">
                    <span>Alumno</span><span>Precisión</span><span>Riesgo</span>
                  </div>
                  <div class="table-row data">
                    <span>🧑 Miguel</span><span class="pill green">87%</span><span class="pill green">Bajo</span>
                  </div>
                  <div class="table-row data">
                    <span>👧 Ana</span><span class="pill yellow">72%</span><span class="pill yellow">Medio</span>
                  </div>
                  <div class="table-row data">
                    <span>🧒 Carlos</span><span class="pill red">45%</span><span class="pill red">Alto</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="demo-feature slide-up delay-2" style="display:none">
          <div class="feature-card">
            <div class="feature-icon">🎯</div>
            <div class="feature-content">
              <h4>Alertas Inteligentes</h4>
              <p>Recibe notificaciones cuando un alumno necesita atención especial</p>
              <div class="feature-visual">
                <div class="alert-preview urgent">
                  <div class="alert-icon">⚠️</div>
                  <div>
                    <strong>Carlos López</strong> tiene dificultad en Restas
                    <div class="alert-action">Ver recomendaciones →</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="demo-feature slide-up delay-3" style="display:none">
          <div class="feature-card">
            <div class="feature-icon">📈</div>
            <div class="feature-content">
              <h4>Reportes Detallados</h4>
              <p>Genera reportes personalizados con recomendaciones pedagógicas automáticas</p>
              <div class="feature-visual">
                <div class="report-preview">
                  <div class="report-header">📄 Reporte Semanal</div>
                  <div class="report-stat">
                    <span>Promedio Grupal:</span>
                    <strong style="color:#10B981">76%</strong>
                  </div>
                  <div class="report-stat">
                    <span>Alumnos en Riesgo:</span>
                    <strong style="color:#EF4444">3</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `,
      
      parent: `
        <div class="demo-intro fade-in">
          <div class="demo-avatar">👪</div>
          <h3>Panel de Padres</h3>
          <p>Acompaña el aprendizaje de tus hijos</p>
        </div>
        <div class="demo-feature slide-up delay-1" style="display:none">
          <div class="feature-card">
            <div class="feature-icon">📱</div>
            <div class="feature-content">
              <h4>Seguimiento en Tiempo Real</h4>
              <p>Revisa el progreso diario de tu hijo desde cualquier dispositivo</p>
              <div class="feature-visual">
                <div class="child-card">
                  <div class="child-header">
                    <span class="child-name">👦 Miguel Hernández</span>
                    <span class="child-grade">2° Primaria</span>
                  </div>
                  <div class="child-stats">
                    <div class="stat-item">
                      <div class="stat-label">Racha</div>
                      <div class="stat-value">🔥 7 días</div>
                    </div>
                    <div class="stat-item">
                      <div class="stat-label">Puntos</div>
                      <div class="stat-value">⭐ 1,247</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="demo-feature slide-up delay-2" style="display:none">
          <div class="feature-card">
            <div class="feature-icon">💡</div>
            <div class="feature-content">
              <h4>Recomendaciones Personalizadas</h4>
              <p>Recibe sugerencias sobre cómo apoyar a tu hijo en casa</p>
              <div class="feature-visual">
                <div class="recommendation-card">
                  <div class="rec-icon">📚</div>
                  <div>
                    <strong>Comprensión Lectora</strong>
                    <p style="font-size:0.85rem;color:#64748B;margin-top:0.25rem">
                      Lee con él 15 min al día. Pregunta: ¿de qué trata? ¿quién? ¿qué pasa?
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="demo-feature slide-up delay-3" style="display:none">
          <div class="feature-card">
            <div class="feature-icon">🔔</div>
            <div class="feature-content">
              <h4>Alertas Importantes</h4>
              <p>Mantente informado sobre el desempeño y necesidades de tu hijo</p>
              <div class="feature-visual">
                <div class="notification-preview success">
                  <div class="notif-icon">🎉</div>
                  <div>
                    <strong>¡Logro desbloqueado!</strong>
                    <p>Miguel alcanzó 7 días de racha</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `
    };
    
    return screens[role] || screens.student;
  },

  _animateDemo(role) {
    // Show features one by one
    const features = document.querySelectorAll('.demo-feature');
    features.forEach((f, i) => {
      setTimeout(() => {
        f.style.display = 'block';
        // Trigger animations
        if (role === 'student' && i === 2) {
          setTimeout(() => {
            document.querySelectorAll('.fill').forEach(fill => {
              fill.style.width = fill.classList.contains('math-fill') ? '85%' : '92%';
            });
          }, 300);
        }
      }, i * 1500);
    });
  },

  _getStyles() {
    return `
      .demo-modal {
        position: fixed;
        inset: 0;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      .demo-modal.show { opacity: 1; }
      
      .demo-overlay {
        position: absolute;
        inset: 0;
        background: rgba(15, 23, 42, 0.8);
        backdrop-filter: blur(8px);
      }
      
      .demo-container {
        position: relative;
        background: white;
        border-radius: 1.5rem;
        max-width: 900px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 25px 60px rgba(0,0,0,0.3);
        animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
      
      @keyframes slideUp {
        from { opacity: 0; transform: translateY(50px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      .demo-close {
        position: absolute;
        top: 1.5rem;
        right: 1.5rem;
        background: #F1F5F9;
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        font-size: 1.5rem;
        cursor: pointer;
        transition: all 0.2s;
        z-index: 10;
      }
      .demo-close:hover {
        background: #E2E8F0;
        transform: rotate(90deg);
      }
      
      .demo-header {
        text-align: center;
        padding: 2.5rem 2rem 1.5rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }
      .demo-header h2 {
        font-family: 'Fredoka', sans-serif;
        font-size: 1.75rem;
        margin-bottom: 0.5rem;
      }
      .demo-header p {
        opacity: 0.9;
        font-size: 0.95rem;
      }
      
      .demo-tabs {
        display: flex;
        gap: 0.5rem;
        padding: 1.5rem;
        background: #F8FAFC;
        border-bottom: 1px solid #E2E8F0;
      }
      
      .demo-tab {
        flex: 1;
        padding: 1rem;
        border: 2px solid #E2E8F0;
        background: white;
        border-radius: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        transition: all 0.3s;
        font-family: 'Fredoka', sans-serif;
      }
      .demo-tab:hover {
        border-color: #7C3AED;
        transform: translateY(-2px);
      }
      .demo-tab.active {
        border-color: #7C3AED;
        background: linear-gradient(135deg, rgba(102,126,234,0.1), rgba(118,75,162,0.1));
      }
      .demo-tab .tab-icon {
        font-size: 2rem;
      }
      .demo-tab .tab-label {
        font-size: 0.9rem;
        font-weight: 600;
        color: #334155;
      }
      
      .demo-screen-wrap {
        min-height: 400px;
        padding: 2rem;
      }
      
      .demo-screen {
        min-height: 350px;
      }
      
      .demo-intro {
        text-align: center;
        padding: 2rem 1rem;
      }
      .demo-avatar {
        font-size: 5rem;
        margin-bottom: 1rem;
      }
      .demo-intro h3 {
        font-family: 'Fredoka', sans-serif;
        font-size: 1.75rem;
        margin-bottom: 0.5rem;
      }
      .demo-intro p {
        color: #64748B;
        font-size: 1rem;
      }
      
      .demo-feature {
        margin-bottom: 1.5rem;
      }
      
      .feature-card {
        background: #F8FAFC;
        border-radius: 1.25rem;
        padding: 1.5rem;
        display: flex;
        gap: 1.25rem;
        border: 1px solid #E2E8F0;
      }
      .feature-icon {
        font-size: 2.5rem;
        flex-shrink: 0;
      }
      .feature-content h4 {
        font-family: 'Fredoka', sans-serif;
        font-size: 1.1rem;
        margin-bottom: 0.5rem;
      }
      .feature-content p {
        color: #64748B;
        font-size: 0.9rem;
        margin-bottom: 1rem;
      }
      
      .feature-visual {
        background: white;
        border-radius: 0.75rem;
        padding: 1rem;
        border: 1px solid #E2E8F0;
      }
      
      .difficulty-bar {
        display: flex;
        gap: 0.5rem;
      }
      .diff-level {
        flex: 1;
        padding: 0.75rem;
        border-radius: 0.5rem;
        text-align: center;
        font-weight: 600;
        font-size: 0.85rem;
        animation: pulse 2s infinite;
      }
      .diff-level.easy { background: #D1FAE5; color: #065F46; }
      .diff-level.medium { background: #FEF3C7; color: #92400E; }
      .diff-level.hard { background: #FEE2E2; color: #991B1B; }
      
      .achievements-preview {
        display: flex;
        gap: 1rem;
        justify-content: center;
      }
      .achievement {
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        border-radius: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        box-shadow: 0 4px 12px rgba(102,126,234,0.3);
      }
      .unlock-anim {
        animation: unlockBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
      @keyframes unlockBounce {
        0% { transform: scale(0) rotate(-180deg); opacity: 0; }
        50% { transform: scale(1.2) rotate(10deg); }
        100% { transform: scale(1) rotate(0deg); opacity: 1; }
      }
      
      .progress-bars {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      .progress-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 0.85rem;
      }
      .progress-item > span:first-child {
        min-width: 90px;
        font-weight: 600;
      }
      .bar {
        flex: 1;
        height: 8px;
        background: #E2E8F0;
        border-radius: 999px;
        overflow: hidden;
      }
      .fill {
        height: 100%;
        width: 0;
        border-radius: 999px;
        transition: width 2s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .math-fill { background: linear-gradient(90deg, #667eea, #764ba2); }
      .spanish-fill { background: linear-gradient(90deg, #f093fb, #f5576c); }
      .pct {
        min-width: 40px;
        font-weight: 700;
        color: #7C3AED;
      }
      
      .student-table-preview {
        font-size: 0.85rem;
      }
      .table-row {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr;
        padding: 0.75rem;
        gap: 1rem;
        border-bottom: 1px solid #E2E8F0;
      }
      .table-row.header {
        font-weight: 700;
        background: #F8FAFC;
        border-radius: 0.5rem;
      }
      .table-row.data {
        animation: fadeInRow 0.4s ease;
      }
      @keyframes fadeInRow {
        from { opacity: 0; transform: translateX(-10px); }
        to { opacity: 1; transform: translateX(0); }
      }
      .pill {
        padding: 0.25rem 0.75rem;
        border-radius: 999px;
        font-weight: 600;
        font-size: 0.75rem;
        text-align: center;
      }
      .pill.green { background: #D1FAE5; color: #065F46; }
      .pill.yellow { background: #FEF3C7; color: #92400E; }
      .pill.red { background: #FEE2E2; color: #991B1B; }
      
      .alert-preview, .notification-preview, .recommendation-card {
        display: flex;
        gap: 1rem;
        padding: 1rem;
        border-radius: 0.75rem;
        animation: slideInRight 0.5s ease;
      }
      @keyframes slideInRight {
        from { opacity: 0; transform: translateX(20px); }
        to { opacity: 1; transform: translateX(0); }
      }
      .alert-preview.urgent {
        background: #FEF2F2;
        border-left: 4px solid #EF4444;
      }
      .notification-preview.success {
        background: #F0FDF4;
        border-left: 4px solid #10B981;
      }
      .alert-icon, .notif-icon, .rec-icon {
        font-size: 2rem;
        flex-shrink: 0;
      }
      .alert-action {
        color: #7C3AED;
        font-size: 0.85rem;
        font-weight: 600;
        margin-top: 0.5rem;
        cursor: pointer;
      }
      
      .report-preview {
        padding: 1rem;
        border: 2px dashed #CBD5E1;
        border-radius: 0.75rem;
      }
      .report-header {
        font-weight: 700;
        margin-bottom: 0.75rem;
        font-size: 0.95rem;
      }
      .report-stat {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
        border-bottom: 1px solid #E2E8F0;
      }
      
      .child-card {
        background: linear-gradient(135deg, rgba(102,126,234,0.1), rgba(118,75,162,0.1));
        border-radius: 1rem;
        padding: 1.25rem;
      }
      .child-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }
      .child-name {
        font-weight: 700;
        font-size: 1rem;
      }
      .child-grade {
        background: white;
        padding: 0.25rem 0.75rem;
        border-radius: 999px;
        font-size: 0.75rem;
        font-weight: 600;
        color: #7C3AED;
      }
      .child-stats {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }
      .stat-item {
        background: white;
        padding: 0.75rem;
        border-radius: 0.75rem;
        text-align: center;
      }
      .stat-label {
        font-size: 0.75rem;
        color: #64748B;
        margin-bottom: 0.25rem;
      }
      .stat-value {
        font-weight: 700;
        font-size: 1.1rem;
      }
      
      .recommendation-card {
        background: #FEF3C7;
        border-left: 4px solid #F59E0B;
      }
      
      .demo-controls {
        display: flex;
        justify-content: center;
        padding: 1.5rem 2rem 0;
      }
      .demo-control-btn {
        padding: 0.75rem 1.5rem;
        background: #F1F5F9;
        border: none;
        border-radius: 999px;
        font-family: 'Fredoka', sans-serif;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }
      .demo-control-btn:hover {
        background: #E2E8F0;
        transform: scale(1.05);
      }
      
      .demo-footer {
        text-align: center;
        padding: 2rem;
        border-top: 1px solid #E2E8F0;
        background: #F8FAFC;
      }
      .btn-cta {
        padding: 1rem 2.5rem;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border: none;
        border-radius: 999px;
        font-family: 'Fredoka', sans-serif;
        font-size: 1.1rem;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 10px 25px rgba(102,126,234,0.3);
        transition: all 0.3s;
      }
      .btn-cta:hover {
        transform: translateY(-3px);
        box-shadow: 0 15px 35px rgba(102,126,234,0.4);
      }
      
      .fade-in {
        animation: fadeIn 0.6s ease;
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      .slide-up {
        animation: slideUpAnim 0.6s ease;
      }
      @keyframes slideUpAnim {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      .delay-1 { animation-delay: 0.2s; }
      .delay-2 { animation-delay: 0.4s; }
      .delay-3 { animation-delay: 0.6s; }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
      }
      
      @media (max-width: 768px) {
        .demo-container {
          border-radius: 0;
          max-height: 100vh;
        }
        .demo-tabs {
          flex-direction: column;
        }
        .demo-header h2 {
          font-size: 1.5rem;
        }
        .feature-card {
          flex-direction: column;
        }
        .demo-avatar {
          font-size: 3rem;
        }
      }
    `;
  }
};