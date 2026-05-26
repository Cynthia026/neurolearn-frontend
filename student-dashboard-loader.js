// student-dashboard-loader.js
// Script para cargar datos reales del estudiante desde MySQL

(async function() {
  console.log('🔄 Cargando datos del estudiante...');

  try {
    // Obtener perfil completo del estudiante
    const profileData = await API.students.getProfile();
    
    if (!profileData.success) {
      throw new Error('Error al cargar perfil');
    }

    const { user, studentProfile, stats, recentGames, achievements } = profileData.data;
    
    console.log('✅ Datos cargados:', profileData.data);

    // ==================== ACTUALIZAR NOMBRE ====================
    const nameElement = document.getElementById('student-name');
    if (nameElement) {
      nameElement.textContent = `¡Hola, ${user.firstName}!`;
    }

    // ==================== ACTUALIZAR PUNTOS ====================
    const pointsElement = document.getElementById('student-points');
    if (pointsElement) {
      pointsElement.textContent = studentProfile.points || 0;
    }

    // ==================== ACTUALIZAR RACHA ====================
    const streakElement = document.getElementById('student-streak');
    if (streakElement) {
      streakElement.textContent = `${studentProfile.streak || 0} días`;
    }

    // ==================== ACTUALIZAR NIVEL ====================
    const levelElement = document.getElementById('student-level');
    if (levelElement) {
      levelElement.textContent = studentProfile.level || 1;
    }

    // ==================== ACTUALIZAR GRADO ====================
    const gradeElement = document.getElementById('student-grade');
    if (gradeElement) {
      gradeElement.textContent = `${studentProfile.grade}° Primaria`;
    }

    // ==================== ACTUALIZAR ESTADÍSTICAS ====================
    const totalGamesElement = document.getElementById('total-games');
    if (totalGamesElement) {
      totalGamesElement.textContent = stats.totalGames || 0;
    }

    const avgScoreElement = document.getElementById('avg-score');
    if (avgScoreElement) {
      avgScoreElement.textContent = Math.round(stats.avgScore || 0);
    }

    const avgAccuracyElement = document.getElementById('avg-accuracy');
    if (avgAccuracyElement) {
      avgAccuracyElement.textContent = `${Math.round(stats.avgAccuracy || 0)}%`;
    }

    // ==================== ACTUALIZAR LOGROS ====================
    const achievementsContainer = document.getElementById('achievements-container');
    if (achievementsContainer && achievements.length > 0) {
      achievementsContainer.innerHTML = achievements.map(achievement => `
        <div class="achievement-card">
          <div class="achievement-icon">${achievement.icon}</div>
          <div class="achievement-info">
            <h4>${achievement.name}</h4>
            <p>${achievement.description}</p>
            <small>${new Date(achievement.unlockedAt).toLocaleDateString()}</small>
          </div>
        </div>
      `).join('');
    } else if (achievementsContainer) {
      achievementsContainer.innerHTML = `
        <div class="no-achievements">
          <p>🎯 Aún no tienes logros desbloqueados</p>
          <p>¡Juega más para desbloquear logros!</p>
        </div>
      `;
    }

    // ==================== ACTUALIZAR JUEGOS RECIENTES ====================
    const recentGamesContainer = document.getElementById('recent-games');
    if (recentGamesContainer && recentGames.length > 0) {
      recentGamesContainer.innerHTML = recentGames.slice(0, 5).map(game => {
        const date = new Date(game.createdAt);
        const gameTypeLabel = getGameTypeLabel(game.gameType);
        
        return `
          <div class="game-record">
            <div class="game-icon">${getGameIcon(game.gameType)}</div>
            <div class="game-details">
              <h4>${gameTypeLabel}</h4>
              <p>Puntuación: ${game.score} | Precisión: ${game.accuracy}%</p>
              <small>${date.toLocaleDateString()} ${date.toLocaleTimeString()}</small>
            </div>
            <div class="game-level">Nivel ${game.level}</div>
          </div>
        `;
      }).join('');
    } else if (recentGamesContainer) {
      recentGamesContainer.innerHTML = `
        <div class="no-games">
          <p>🎮 Aún no has jugado</p>
          <p>¡Empieza a jugar para ver tu historial!</p>
        </div>
      `;
    }

    // ==================== CALCULAR PROGRESO ====================
    // Calcular nivel basado en puntos
    const pointsForNextLevel = (studentProfile.level * 100);
    const progressPercent = Math.min(100, (studentProfile.points % 100));
    
    const progressBar = document.getElementById('level-progress');
    if (progressBar) {
      progressBar.style.width = `${progressPercent}%`;
    }

    const progressText = document.getElementById('progress-text');
    if (progressText) {
      progressText.textContent = `${studentProfile.points % 100} / 100 puntos para nivel ${studentProfile.level + 1}`;
    }

    console.log('✅ Dashboard actualizado con datos reales');

  } catch (error) {
    console.error('❌ Error cargando datos:', error);
    
    // Mostrar mensaje de error al usuario
    const errorContainer = document.getElementById('error-message');
    if (errorContainer) {
      errorContainer.style.display = 'block';
      errorContainer.textContent = `Error: ${error.message}`;
    }
  }
})();

// ==================== FUNCIONES AUXILIARES ====================

function getGameTypeLabel(gameType) {
  const labels = {
    'MATH_GAME':   'Math Blaster',
    'MEMORY_GAME': 'Memory Match',
    'NUMBER_LINE': 'Number Line Jump',
    'WORD_GAME':   'Constructor de Palabras',
    'SPANISH_GAME':'Español',
    'LOGIC_GAME':  'Lógica'
  };
  return labels[gameType] || gameType;
}

function getGameIcon(gameType) {
  const icons = {
    'MATH_GAME':   '🔢',
    'MEMORY_GAME': '🧠',
    'NUMBER_LINE': '🦘',
    'WORD_GAME':   '📝',
    'SPANISH_GAME':'📚',
    'LOGIC_GAME':  '🧩'
  };
  return icons[gameType] || '🎮';
}

// ── Cargar contenido asignado por el maestro ─────────────
(async function loadAssignedContent() {
  try {
    const [contentRes, activitiesRes] = await Promise.all([
      API.studentContent.getAssigned(),
      API.studentContent.getActivities()
    ]);

    // Contenido asignado
    const contentContainer = document.getElementById('assigned-content');
    if (contentContainer && contentRes.success) {
      const pending = contentRes.data.filter(a => !a.completed);
      if (pending.length === 0) {
        contentContainer.innerHTML = '<p style="color:#999;font-size:14px">No tienes contenido pendiente 🎉</p>';
      } else {
        const typeIcon = { VIDEO:'🎬', PDF:'📄', GAME:'🎮', EXERCISE:'✏️', LINK:'🔗' };
        contentContainer.innerHTML = pending.map(a => `
          <div style="background:#F8FAFC;border-radius:12px;padding:12px 16px;margin-bottom:10px;border-left:3px solid #6C63FF;display:flex;align-items:center;gap:12px;">
            <span style="font-size:1.5rem">${typeIcon[a.content.type] || '📌'}</span>
            <div style="flex:1">
              <div style="font-weight:700;font-size:0.9rem">${a.content.title}</div>
              <div style="font-size:0.78rem;color:#64748B">${a.teacher} · ${a.content.subject}${a.dueDate ? ' · Entrega: '+new Date(a.dueDate).toLocaleDateString('es-MX') : ''}</div>
            </div>
            <button onclick="markContentDone(${a.assignmentId}, this)"
              style="padding:6px 14px;border-radius:8px;border:none;background:#6C63FF;color:white;font-size:0.78rem;font-weight:700;cursor:pointer">
              ✓ Listo
            </button>
          </div>`).join('');
      }
    }

    // Actividades del maestro
    const actContainer = document.getElementById('teacher-activities');
    if (actContainer && activitiesRes.success) {
      const acts = activitiesRes.data.slice(0, 3);
      const gameMap = { MATH_GAME:'math-blaster.html', MEMORY_GAME:'memory-match.html', NUMBER_LINE:'number-line-jump.html', WORD_GAME:'word-builder.html' };
      if (acts.length === 0) {
        actContainer.innerHTML = '<p style="color:#999;font-size:14px">Sin actividades por ahora</p>';
      } else {
        actContainer.innerHTML = acts.map(a => `
          <div style="background:#F8FAFC;border-radius:12px;padding:12px 16px;margin-bottom:10px;display:flex;align-items:center;gap:12px;">
            <span style="font-size:1.5rem">📋</span>
            <div style="flex:1">
              <div style="font-weight:700;font-size:0.9rem">${a.title}</div>
              <div style="font-size:0.78rem;color:#64748B">${a.teacher}${a.dueDate ? ' · Entrega: '+new Date(a.dueDate).toLocaleDateString('es-MX') : ''}${a.minScore ? ' · Mín: '+a.minScore+' pts' : ''}</div>
            </div>
            ${a.gameType && gameMap[a.gameType] ? `<button onclick="window.location.href='${gameMap[a.gameType]}'" style="padding:6px 14px;border-radius:8px;border:none;background:#22C55E;color:white;font-size:0.78rem;font-weight:700;cursor:pointer">▶ Jugar</button>` : ''}
          </div>`).join('');
      }
    }

  } catch(e) {
    console.warn('⚠️ No se pudo cargar contenido asignado:', e.message);
  }
})();

// Marcar contenido como completado
async function markContentDone(assignmentId, btn) {
  btn.disabled = true;
  btn.textContent = '...';
  const res = await API.studentContent.markComplete(assignmentId);
  if (res.success) {
    btn.closest('div[style]').style.opacity = '0.4';
    btn.textContent = '✓ Hecho';
  } else {
    btn.disabled = false;
    btn.textContent = '✓ Listo';
  }
}
