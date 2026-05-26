// ============================================================
// game-integration.js — Integración de Juegos con el Backend
// NeuroLearn Kids
// ============================================================

/**
 * Guarda la puntuación de un juego en el backend.
 * 
 * @param {string} gameType   - Tipo de juego: 'MATH_GAME', 'MEMORY_GAME', 'NUMBER_LINE', 'WORD_GAME'
 * @param {number} score      - Puntuación obtenida
 * @param {number} timeSpent  - Tiempo en segundos
 * @param {number} accuracy   - Precisión en porcentaje (0-100)
 * @param {number} level      - Nivel del juego
 * @returns {object|null}     - Respuesta del servidor, o null si falla
 */
async function saveGameScore(gameType, score, timeSpent, accuracy, level = 1) {
  const token = localStorage.getItem('token');

  if (!token) {
    console.warn('⚠️ No hay sesión activa. La puntuación no se guardará.');
    return null;
  }

  try {
    const response = await fetch('http://localhost:3000/api/games/score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        gameType,
        score:      Math.round(score),
        timeSpent:  Math.round(timeSpent),
        accuracy:   Math.min(100, Math.max(0, Math.round(accuracy))),
        level:      Math.round(level)
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Error al guardar puntuación:', data.message);
      return null;
    }

    console.log(`✅ Puntuación guardada: ${score} pts | +${data.data.pointsAdded} puntos | Racha: ${data.data.streak} días`);

    // Mostrar notificación visual si existe la función
    if (typeof showGameSavedNotification === 'function') {
      showGameSavedNotification(data.data);
    } else {
      _showDefaultNotification(data.data);
    }

    return data;

  } catch (error) {
    // Red caída o backend no disponible — no romper el juego
    console.warn('⚠️ Backend no disponible. Modo offline.', error.message);
    return null;
  }
}

/**
 * Muestra una notificación flotante con el resultado guardado.
 * Se usa si el juego no tiene su propia función showGameSavedNotification.
 */
function _showDefaultNotification(resultData) {
  // Crear contenedor si no existe
  let notif = document.getElementById('_nl-save-notif');
  if (!notif) {
    notif = document.createElement('div');
    notif.id = '_nl-save-notif';
    notif.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #6C63FF, #4CAF50);
      color: white;
      padding: 14px 20px;
      border-radius: 12px;
      font-family: 'Nunito', sans-serif;
      font-size: 14px;
      font-weight: 700;
      box-shadow: 0 8px 24px rgba(0,0,0,0.25);
      z-index: 99999;
      transition: all 0.4s ease;
      opacity: 0;
      transform: translateY(-10px);
      max-width: 280px;
    `;
    document.body.appendChild(notif);
  }

  notif.innerHTML = `
    ✅ ¡Puntuación guardada!<br>
    <span style="font-size:12px;font-weight:400">
      +${resultData.pointsAdded} puntos · Racha: ${resultData.streak} días 🔥
    </span>
  `;

  // Animar entrada
  setTimeout(() => {
    notif.style.opacity = '1';
    notif.style.transform = 'translateY(0)';
  }, 50);

  // Animar salida
  setTimeout(() => {
    notif.style.opacity = '0';
    notif.style.transform = 'translateY(-10px)';
  }, 3500);
}

// ============================================================
// Helpers para cada juego
// ============================================================

/**
 * Math Blaster — llama al final del juego
 * @param {number} score       - Puntuación final del juego
 * @param {number} timeSpent   - Segundos jugados (default: 60)
 * @param {number} correct     - Respuestas correctas
 * @param {number} total       - Total de preguntas
 * @param {number} level       - Nivel de dificultad
 */
async function saveScoreMathBlaster(score, timeSpent = 60, correct = 0, total = 1, level = 1) {
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  return saveGameScore('MATH_GAME', score, timeSpent, accuracy, level);
}

/**
 * Memory Match — llama al final del juego
 * @param {number} pairs       - Pares encontrados
 * @param {number} moves       - Movimientos totales
 * @param {number} timeSpent   - Segundos jugados
 * @param {number} totalPairs  - Total de pares disponibles
 * @param {number} level       - Nivel
 */
async function saveScoreMemoryMatch(pairs, moves, timeSpent, totalPairs = pairs, level = 1) {
  // Puntuación: más puntos si encontró todo con pocos movimientos y poco tiempo
  const efficiency = moves > 0 ? (totalPairs / moves) : 1;
  const timeBonus  = Math.max(0, 300 - timeSpent);
  const score      = Math.round(pairs * 100 * efficiency + timeBonus);
  const accuracy   = moves > 0 ? Math.min(100, Math.round((totalPairs / moves) * 100)) : 100;

  return saveGameScore('MEMORY_GAME', score, timeSpent, accuracy, level);
}

/**
 * Number Line Jump — llama al final del juego
 * @param {number} score       - Puntuación del juego
 * @param {number} timeSpent   - Segundos jugados
 * @param {number} correct     - Respuestas correctas
 * @param {number} total       - Total de preguntas
 * @param {number} level       - Nivel
 */
async function saveScoreNumberLine(score, timeSpent = 60, correct = 0, total = 1, level = 1) {
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  return saveGameScore('NUMBER_LINE', score, timeSpent, accuracy, level);
}

/**
 * Word Builder (Spell Master) — llama al final del juego
 * @param {number} wordsCompleted - Palabras completadas
 * @param {number} timeSpent      - Segundos jugados
 * @param {number} score          - Puntuación
 * @param {number} streak         - Racha de palabras
 * @param {number} level          - Nivel
 */
async function saveScoreWordBuilder(wordsCompleted, timeSpent, score, streak = 0, level = 1) {
  // Precisión estimada: basada en el streak respecto a palabras totales
  const accuracy = wordsCompleted > 0 ? Math.min(100, Math.round((streak / wordsCompleted) * 100) + 50) : 0;
  return saveGameScore('WORD_GAME', score || wordsCompleted * 100, timeSpent, accuracy, level);
}
