// ============================================================
// teacher-dashboard-loader.js
// Carga datos reales del backend para el dashboard del docente
// NeuroLearn Kids
// ============================================================

(async function () {
  console.log('🏫 Cargando datos del dashboard docente...');

  try {
    // ── 1. Obtener lista de estudiantes ──────────────────────
    // Primero intenta con alumnos propios del maestro
    let studentsData, totalStudents;
    const myStudentsRes = await API.family.getMyStudents();

    if (myStudentsRes.success && myStudentsRes.data.students.length > 0) {
      studentsData   = myStudentsRes.data.students;
      totalStudents  = myStudentsRes.data.total;
      console.log(`✅ ${totalStudents} alumnos del maestro cargados`);
    } else {
      // Fallback: mostrar todos si no tiene alumnos asignados aún
      const allRes = await API.students.getAll();
      if (!allRes.success) throw new Error(allRes.message || 'Error al obtener estudiantes');
      studentsData  = allRes.data.students;
      totalStudents = allRes.data.totalStudents;
      console.log(`✅ ${totalStudents} estudiantes (todos) cargados`);
    }

    const students = studentsData;

    // ── 2. Actualizar contadores del header ──────────────────
    _setEl('total-students',    totalStudents);
    _setEl('active-students',   students.filter(s => s.recentActivity).length);

    const atRisk = students.filter(s => s.riskLevel === 'alto').length;
    _setEl('at-risk-students',  atRisk);

    const avgAccuracy = totalStudents > 0
      ? Math.round(students.reduce((sum, s) => sum + (s.avgAccuracy || 0), 0) / totalStudents)
      : 0;
    _setEl('avg-class-accuracy', `${avgAccuracy}%`);

    // ── 3. Tabla de estudiantes ──────────────────────────────
    const tbody = document.getElementById('students-table-body');
    if (tbody) {
      if (students.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="7" style="text-align:center;padding:2rem;color:#999">
              No hay estudiantes registrados aún.
            </td>
          </tr>`;
      } else {
        tbody.innerHTML = students.map(s => {
          const riskClass = { alto: 'risk-high', medio: 'risk-medium', bajo: 'risk-low' }[s.riskLevel] || 'risk-low';
          const riskLabel = { alto: 'Alto', medio: 'Medio', bajo: 'Bajo' }[s.riskLevel] || 'Bajo';
          const lastActive = s.recentActivity
            ? new Date(s.recentActivity).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })
            : 'Sin actividad';

          return `
            <tr>
              <td>
                <div class="student-name-cell">
                  <div class="student-avatar">${s.firstName.charAt(0)}${s.lastName.charAt(0)}</div>
                  <div>
                    <strong>${s.firstName} ${s.lastName}</strong>
                    <small style="display:block;color:#999">${s.email}</small>
                  </div>
                </div>
              </td>
              <td>${s.grade}° Primaria</td>
              <td>
                <div class="progress-bar-wrap">
                  <div class="progress-bar-fill" style="width:${s.avgAccuracy || 0}%"></div>
                </div>
                <small>${s.avgAccuracy || 0}%</small>
              </td>
              <td>${s.totalGames || 0} partidas</td>
              <td>${s.points || 0} pts</td>
              <td><span class="risk-badge ${riskClass}">${riskLabel}</span></td>
              <td>${lastActive}</td>
            </tr>`;
        }).join('');
      }
    }

    // ── 4. Top 3 estudiantes ─────────────────────────────────
    const topContainer = document.getElementById('top-students');
    if (topContainer) {
      const top3 = [...students]
        .sort((a, b) => (b.points || 0) - (a.points || 0))
        .slice(0, 3);

      const medals = ['🥇', '🥈', '🥉'];
      topContainer.innerHTML = top3.map((s, i) => `
        <div class="top-student-row">
          <span class="medal">${medals[i]}</span>
          <span class="top-name">${s.firstName} ${s.lastName}</span>
          <span class="top-points">${s.points || 0} pts</span>
        </div>
      `).join('') || '<p style="color:#999;font-size:14px">Sin datos aún</p>';
    }

    // ── 5. Distribución de riesgo ────────────────────────────
    const riskCounts = { alto: 0, medio: 0, bajo: 0 };
    students.forEach(s => { riskCounts[s.riskLevel] = (riskCounts[s.riskLevel] || 0) + 1; });

    _setEl('risk-high-count',   riskCounts.alto);
    _setEl('risk-medium-count', riskCounts.medio);
    _setEl('risk-low-count',    riskCounts.bajo);

  } catch (error) {
    console.error('❌ Error cargando dashboard docente:', error.message);

    // Mostrar error amigable en la tabla si existe
    const tbody = document.getElementById('students-table-body');
    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center;padding:2rem;color:#e74c3c">
            ⚠️ No se pudieron cargar los estudiantes.<br>
            <small>Verifica que el servidor esté corriendo en <code>http://localhost:3000</code></small>
          </td>
        </tr>`;
    }
  }

  // ── Helper: setear texto de un elemento por id ──────────────
  function _setEl(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }
})();
