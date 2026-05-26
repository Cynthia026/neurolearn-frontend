// api-config.js - Configuración de API para NeuroLearn

// ── Detecta automáticamente si estás en local o en producción ──
const API_BASE_URL = (() => {
  const host = window.location.hostname;
  // Si es localhost o 127.0.0.1 → backend local
  if (host === 'localhost' || host === '127.0.0.1') {
    return 'http://localhost:3000/api';
  }
  // En producción (Vercel) → URL de Render
  // ⚠️ CAMBIA ESTO por tu URL real de Render después de desplegar
  return 'https://neurolearn-backend-0dvt.onrender.com/api';
})();

// ============================================
// CONFIGURACIÓN DE HEADERS
// ============================================

const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json'
  };

  if (includeAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

// ============================================
// API ENDPOINTS
// ============================================

const API = {
  // ==================== AUTH ====================
  auth: {
    /**
     * Registrar nuevo usuario
     */
    register: async (userData) => {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: getHeaders(false),
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en registro');
      }

      return data;
    },

    /**
     * Login
     */
    login: async (email, password) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(false),
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en login');
      }

      return data;
    },

    /**
     * Obtener usuario actual
     */
    getMe: async () => {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: getHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener usuario');
      }

      return data;
    }
  },

  // ==================== STUDENTS ====================
  students: {
    /**
     * Obtener perfil completo del estudiante actual
     */
    getProfile: async () => {
      const response = await fetch(`${API_BASE_URL}/students/profile`, {
        headers: getHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener perfil');
      }

      return data;
    },

    /**
     * Obtener todos los estudiantes (solo TEACHER)
     */
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/students/all`, {
        headers: getHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener estudiantes');
      }

      return data;
    },

    /**
     * Obtener estudiante por ID (solo TEACHER)
     */
    getById: async (studentId) => {
      const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
        headers: getHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener estudiante');
      }

      return data;
    }
  },

  // ==================== GAMES ====================
  games: {
    /**
     * Guardar puntuación de un juego
     */
    saveScore: async (scoreData) => {
      const response = await fetch(`${API_BASE_URL}/games/score`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(scoreData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al guardar puntuación');
      }

      return data;
    },

    /**
     * Obtener historial de juegos
     */
    getHistory: async () => {
      const response = await fetch(`${API_BASE_URL}/games/history`, {
        headers: getHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener historial');
      }

      return data;
    }
  },

  // ==================== CONTENT ====================
  content: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/content`, {
        headers: getHeaders()
      });
      return await response.json();
    }
  },

  // ==================== TEACHERS ====================
  teachers: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/teachers`, {
        headers: getHeaders()
      });
      return await response.json();
    }
  },

  // ==================== USERS ====================
  users: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: getHeaders()
      });
      return await response.json();
    }
  },

  // ==================== EVALUACIONES ====================
  evaluations: {

    // MAESTRO: crear evaluación con preguntas
    create: async (data) => {
      const r = await fetch(`${API_BASE_URL}/evaluations`, {
        method: 'POST', headers: getHeaders(), body: JSON.stringify(data)
      });
      return r.json();
    },

    // MAESTRO: mis evaluaciones creadas
    getMyEvaluations: async () => {
      const r = await fetch(`${API_BASE_URL}/evaluations/my-evaluations`, { headers: getHeaders() });
      return r.json();
    },

    // MAESTRO: editar evaluación
    update: async (id, data) => {
      const r = await fetch(`${API_BASE_URL}/evaluations/${id}`, {
        method: 'PUT', headers: getHeaders(), body: JSON.stringify(data)
      });
      return r.json();
    },

    // MAESTRO: eliminar evaluación
    delete: async (id) => {
      const r = await fetch(`${API_BASE_URL}/evaluations/${id}`, {
        method: 'DELETE', headers: getHeaders()
      });
      return r.json();
    },

    // MAESTRO: asignar a alumnos
    assign: async (id, studentIds) => {
      const r = await fetch(`${API_BASE_URL}/evaluations/${id}/assign`, {
        method: 'POST', headers: getHeaders(), body: JSON.stringify({ studentIds })
      });
      return r.json();
    },

    // MAESTRO: ver resultados de todos los alumnos
    getResults: async (id) => {
      const r = await fetch(`${API_BASE_URL}/evaluations/${id}/results`, { headers: getHeaders() });
      return r.json();
    },

    // ALUMNO: evaluaciones asignadas
    getAssigned: async () => {
      const r = await fetch(`${API_BASE_URL}/evaluations/assigned`, { headers: getHeaders() });
      return r.json();
    },

    // ALUMNO: iniciar evaluación (recibe preguntas sin respuestas correctas)
    start: async (id) => {
      const r = await fetch(`${API_BASE_URL}/evaluations/${id}/start`, {
        method: 'POST', headers: getHeaders()
      });
      return r.json();
    },

    // ALUMNO: enviar respuestas
    submit: async (assignmentId, answers) => {
      const r = await fetch(`${API_BASE_URL}/evaluations/submit/${assignmentId}`, {
        method: 'POST', headers: getHeaders(), body: JSON.stringify({ answers })
      });
      return r.json();
    },

    // ALUMNO: ver resultado detallado
    getMyResult: async (assignmentId) => {
      const r = await fetch(`${API_BASE_URL}/evaluations/result/${assignmentId}`, { headers: getHeaders() });
      return r.json();
    },

    // COMPARTIDO: detalle de evaluación
    getById: async (id) => {
      const r = await fetch(`${API_BASE_URL}/evaluations/${id}`, { headers: getHeaders() });
      return r.json();
    }
  },

  // ==================== FAMILY (padre-hijo / maestro-alumno) ====================
  family: {

    // PADRE: vincular hijo por email
    addChild: async (studentEmail) => {
      const response = await fetch(`${API_BASE_URL}/family/add-child`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ studentEmail })
      });
      return await response.json();
    },

    // PADRE: obtener sus hijos
    getMyChildren: async () => {
      const response = await fetch(`${API_BASE_URL}/family/my-children`, {
        headers: getHeaders()
      });
      return await response.json();
    },

    // PADRE: desvincular hijo
    removeChild: async (studentId) => {
      const response = await fetch(`${API_BASE_URL}/family/remove-child/${studentId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return await response.json();
    },

    // MAESTRO: agregar alumno por email
    addStudent: async (studentEmail) => {
      const response = await fetch(`${API_BASE_URL}/family/add-student`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ studentEmail })
      });
      return await response.json();
    },

    // MAESTRO: obtener sus alumnos
    getMyStudents: async () => {
      const response = await fetch(`${API_BASE_URL}/family/my-students`, {
        headers: getHeaders()
      });
      return await response.json();
    },

    // MAESTRO: remover alumno del grupo
    removeStudent: async (studentId) => {
      const response = await fetch(`${API_BASE_URL}/family/remove-student/${studentId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return await response.json();
    }
  },

  // ==================== CONTENT (contenido educativo) ====================
  content: {

    // MAESTRO: crear contenido
    create: async (data) => {
      const response = await fetch(`${API_BASE_URL}/content`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return await response.json();
    },

    // MAESTRO: ver su contenido
    getMyContent: async () => {
      const response = await fetch(`${API_BASE_URL}/content/my-content`, {
        headers: getHeaders()
      });
      return await response.json();
    },

    // MAESTRO: asignar contenido a alumnos
    assign: async (contentId, studentIds, dueDate = null) => {
      const response = await fetch(`${API_BASE_URL}/content/assign`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ contentId, studentIds, dueDate })
      });
      return await response.json();
    },

    // MAESTRO: editar contenido
    update: async (contentId, data) => {
      const response = await fetch(`${API_BASE_URL}/content/${contentId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return await response.json();
    },

    // MAESTRO: eliminar contenido
    delete: async (contentId) => {
      const response = await fetch(`${API_BASE_URL}/content/${contentId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return await response.json();
    },

    // ALUMNO: ver contenido asignado por sus maestros
    getMyAssignments: async () => {
      const response = await fetch(`${API_BASE_URL}/content/my-assignments`, {
        headers: getHeaders()
      });
      return await response.json();
    },

    // ALUMNO: marcar asignación como completada
    complete: async (assignmentId) => {
      const response = await fetch(`${API_BASE_URL}/content/complete/${assignmentId}`, {
        method: 'POST',
        headers: getHeaders()
      });
      return await response.json();
    }
  },

  // ── PADRES ──────────────────────────────────────────────
  parents: {
    // Ver hijos vinculados
    getChildren: async () => {
      const r = await fetch(`${API_BASE_URL}/parents/children`, { headers: getHeaders() });
      return r.json();
    },
    // Vincular hijo por email
    linkChild: async (studentEmail) => {
      const r = await fetch(`${API_BASE_URL}/parents/link-child`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ studentEmail })
      });
      return r.json();
    },
    // Desvincular hijo
    unlinkChild: async (studentId) => {
      const r = await fetch(`${API_BASE_URL}/parents/unlink-child/${studentId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return r.json();
    }
  },

  // ── MAESTRO: GESTIÓN ────────────────────────────────────
  teacher: {
    // Alumnos
    getStudents: async () => {
      const r = await fetch(`${API_BASE_URL}/teacher/students`, { headers: getHeaders() });
      return r.json();
    },
    assignStudent: async (studentEmail) => {
      const r = await fetch(`${API_BASE_URL}/teacher/assign-student`, {
        method: 'POST', headers: getHeaders(),
        body: JSON.stringify({ studentEmail })
      });
      return r.json();
    },
    removeStudent: async (studentId) => {
      const r = await fetch(`${API_BASE_URL}/teacher/remove-student/${studentId}`, {
        method: 'DELETE', headers: getHeaders()
      });
      return r.json();
    },

    // Contenido
    getContent: async () => {
      const r = await fetch(`${API_BASE_URL}/teacher/content`, { headers: getHeaders() });
      return r.json();
    },
    createContent: async (data) => {
      const r = await fetch(`${API_BASE_URL}/teacher/content`, {
        method: 'POST', headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return r.json();
    },
    updateContent: async (id, data) => {
      const r = await fetch(`${API_BASE_URL}/teacher/content/${id}`, {
        method: 'PUT', headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return r.json();
    },
    deleteContent: async (id) => {
      const r = await fetch(`${API_BASE_URL}/teacher/content/${id}`, {
        method: 'DELETE', headers: getHeaders()
      });
      return r.json();
    },
    assignContent: async (contentId, studentIds, dueDate) => {
      const r = await fetch(`${API_BASE_URL}/teacher/content/${contentId}/assign`, {
        method: 'POST', headers: getHeaders(),
        body: JSON.stringify({ studentIds, dueDate })
      });
      return r.json();
    },

    // Actividades
    getActivities: async () => {
      const r = await fetch(`${API_BASE_URL}/teacher/activities`, { headers: getHeaders() });
      return r.json();
    },
    createActivity: async (data) => {
      const r = await fetch(`${API_BASE_URL}/teacher/activities`, {
        method: 'POST', headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return r.json();
    },
    deleteActivity: async (id) => {
      const r = await fetch(`${API_BASE_URL}/teacher/activities/${id}`, {
        method: 'DELETE', headers: getHeaders()
      });
      return r.json();
    }
  },

  // ── ESTUDIANTE: CONTENIDO ASIGNADO ──────────────────────
  studentContent: {
    getAssigned: async () => {
      const r = await fetch(`${API_BASE_URL}/content/my-assignments`, { headers: getHeaders() });
      return r.json();
    },
    markComplete: async (assignmentId) => {
      const r = await fetch(`${API_BASE_URL}/content/complete/${assignmentId}`, {
        method: 'POST', headers: getHeaders()
      });
      return r.json();
    },
    getActivities: async () => {
      // Reutiliza el mismo endpoint — actividades son contenido asignado
      const r = await fetch(`${API_BASE_URL}/content/my-assignments`, { headers: getHeaders() });
      return r.json();
    }
  }
};

// ============================================
// UTILIDADES DE AUTENTICACIÓN
// ============================================

/**
 * Verificar si el usuario está autenticado
 */
const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

/**
 * Obtener usuario actual del localStorage
 */
const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error parsing user:', error);
    return null;
  }
};

/**
 * Verificar si el usuario tiene un rol específico
 */
const hasRole = (role) => {
  const user = getCurrentUser();
  return user && user.role === role;
};

/**
 * Cerrar sesión
 */
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'login-register.html';
};

/**
 * Redirigir si no está autenticado
 */
const requireAuth = () => {
  if (!isAuthenticated()) {
    alert('Por favor inicia sesión primero');
    window.location.href = 'login-register.html';
    return false;
  }
  return true;
};

/**
 * Redirigir si no tiene el rol requerido
 */
const requireRole = (role) => {
  if (!requireAuth()) return false;

  if (!hasRole(role)) {
    alert(`Esta página es solo para ${role}s`);
    window.location.href = 'login-register.html';
    return false;
  }

  return true;
};

// ============================================
// EXPORTAR
// ============================================

// Si estás usando módulos ES6
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    API,
    isAuthenticated,
    getCurrentUser,
    hasRole,
    logout,
    requireAuth,
    requireRole
  };
}
