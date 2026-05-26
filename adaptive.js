// ============================================================
// adaptive.js — Motor Adaptativo Completo  v2.0
// ============================================================

const NLAdaptive = {

  // ── Banco de preguntas ───────────────────────────────────
  questions: {
    math: {
      easy: [
        { id:'me01', q:'¿Cuánto es 2 + 1?',   opts:['2','3','4','5'],         ans:1, topic:'sumas'  },
        { id:'me02', q:'¿Cuánto es 5 - 2?',   opts:['2','3','4','1'],         ans:1, topic:'restas' },
        { id:'me03', q:'¿Cuánto es 3 + 3?',   opts:['5','6','7','4'],         ans:1, topic:'sumas'  },
        { id:'me04', q:'¿Cuánto es 8 - 3?',   opts:['4','5','6','3'],         ans:1, topic:'restas' },
        { id:'me05', q:'¿Cuánto es 4 + 2?',   opts:['5','6','7','4'],         ans:1, topic:'sumas'  },
        { id:'me06', q:'¿Cuánto es 7 - 4?',   opts:['2','3','4','1'],         ans:1, topic:'restas' },
        { id:'me07', q:'¿Cuánto es 1 + 5?',   opts:['5','6','7','4'],         ans:1, topic:'sumas'  },
        { id:'me08', q:'¿Cuánto es 9 - 5?',   opts:['3','4','5','2'],         ans:1, topic:'restas' },
        { id:'me09', q:'¿Cuánto es 3 + 0?',   opts:['2','3','4','1'],         ans:1, topic:'sumas'  },
        { id:'me10', q:'¿Cuánto es 6 - 6?',   opts:['1','0','2','6'],         ans:1, topic:'restas' },
      ],
      medium: [
        { id:'mm01', q:'¿Cuánto es 7 + 5?',   opts:['10','12','13','11'],     ans:1, topic:'sumas'  },
        { id:'mm02', q:'¿Cuánto es 10 - 4?',  opts:['5','6','7','8'],         ans:1, topic:'restas' },
        { id:'mm03', q:'¿Cuánto es 8 + 6?',   opts:['13','14','15','12'],     ans:1, topic:'sumas'  },
        { id:'mm04', q:'¿Cuánto es 15 - 7?',  opts:['6','7','8','9'],         ans:2, topic:'restas' },
        { id:'mm05', q:'¿Cuánto es 9 + 8?',   opts:['15','16','17','18'],     ans:2, topic:'sumas'  },
        { id:'mm06', q:'¿Cuánto es 13 - 6?',  opts:['6','7','8','5'],         ans:1, topic:'restas' },
        { id:'mm07', q:'¿Cuánto es 6 + 9?',   opts:['14','15','16','13'],     ans:1, topic:'sumas'  },
        { id:'mm08', q:'¿Cuánto es 18 - 9?',  opts:['8','9','10','7'],        ans:1, topic:'restas' },
        { id:'mm09', q:'¿Cuánto es 7 + 7?',   opts:['13','14','15','12'],     ans:1, topic:'sumas'  },
        { id:'mm10', q:'¿Cuánto es 20 - 8?',  opts:['11','12','13','10'],     ans:1, topic:'restas' },
      ],
      hard: [
        { id:'mh01', q:'¿Cuánto es 23 + 18?', opts:['39','41','40','42'],     ans:1, topic:'sumas'  },
        { id:'mh02', q:'¿Cuánto es 32 - 17?', opts:['13','14','15','16'],     ans:2, topic:'restas' },
        { id:'mh03', q:'¿Cuánto es 45 + 27?', opts:['71','72','73','70'],     ans:1, topic:'sumas'  },
        { id:'mh04', q:'¿Cuánto es 50 - 23?', opts:['25','26','27','28'],     ans:2, topic:'restas' },
        { id:'mh05', q:'¿Cuánto es 34 + 48?', opts:['81','82','83','80'],     ans:1, topic:'sumas'  },
        { id:'mh06', q:'¿Cuánto es 63 - 28?', opts:['33','34','35','36'],     ans:2, topic:'restas' },
        { id:'mh07', q:'¿Cuánto es 56 + 37?', opts:['92','93','94','91'],     ans:1, topic:'sumas'  },
        { id:'mh08', q:'¿Cuánto es 80 - 46?', opts:['33','34','35','36'],     ans:1, topic:'restas' },
        { id:'mh09', q:'¿Cuánto es 29 + 54?', opts:['82','83','84','81'],     ans:1, topic:'sumas'  },
        { id:'mh10', q:'¿Cuánto es 71 - 35?', opts:['35','36','37','34'],     ans:1, topic:'restas' },
      ],
    },
    spanish: {
      easy: [
        { id:'se01', type:'image', q:'¿Cuál imagen es "GATO"?',
          opts:[{e:'🐱',l:'Gato'},{e:'🐶',l:'Perro'},{e:'🐠',l:'Pez'},{e:'🐦',l:'Pájaro'}],     ans:0, topic:'vocabulario' },
        { id:'se02', type:'image', q:'¿Cuál imagen es "SOL"?',
          opts:[{e:'☁️',l:'Nube'},{e:'🌙',l:'Luna'},{e:'☀️',l:'Sol'},{e:'⭐',l:'Estrella'}],      ans:2, topic:'vocabulario' },
        { id:'se03', type:'image', q:'¿Cuál imagen es "CASA"?',
          opts:[{e:'🌳',l:'Árbol'},{e:'🏠',l:'Casa'},{e:'🚗',l:'Carro'},{e:'📚',l:'Libro'}],      ans:1, topic:'vocabulario' },
        { id:'se04', type:'image', q:'¿Cuál imagen es "ÁRBOL"?',
          opts:[{e:'🌊',l:'Mar'},{e:'🌺',l:'Flor'},{e:'🌙',l:'Luna'},{e:'🌳',l:'Árbol'}],         ans:3, topic:'vocabulario' },
        { id:'se05', type:'mcq',   q:'"MA-NO" — ¿cuántas sílabas tiene?',
          opts:['1','2','3','4'],                                                                    ans:1, topic:'silabas'    },
        { id:'se06', type:'mcq',   q:'¿Qué palabra empieza con "P"?',
          opts:['Casa','Mono','Pato','Silla'],                                                       ans:2, topic:'letras'     },
        { id:'se07', type:'mcq',   q:'¿Qué letra falta? "PE_RO"',
          opts:['A','R','T','S'],                                                                    ans:1, topic:'letras'     },
        { id:'se08', type:'image', q:'¿Cuál imagen es "PATO"?',
          opts:[{e:'🐸',l:'Rana'},{e:'🐟',l:'Pez'},{e:'🦆',l:'Pato'},{e:'🐓',l:'Gallo'}],         ans:2, topic:'vocabulario' },
        { id:'se09', type:'mcq',   q:'"PA-LO-MA" — ¿cuántas sílabas?',
          opts:['2','3','4','1'],                                                                    ans:1, topic:'silabas'    },
        { id:'se10', type:'mcq',   q:'¿Qué palabra es un animal?',
          opts:['Mesa','León','Silla','Puerta'],                                                     ans:1, topic:'vocabulario'},
      ],
      medium: [
        { id:'sm01', type:'image', q:'¿Cuál imagen es "MARIPOSA"?',
          opts:[{e:'🐱',l:'Gato'},{e:'🦋',l:'Mariposa'},{e:'🐢',l:'Tortuga'},{e:'🐘',l:'Elefante'}], ans:1, topic:'vocabulario' },
        { id:'sm02', type:'mcq', q:'"El perro corre en el parque." ¿Quién corre?',
          opts:['El parque','El niño','El perro','El gato'],                                         ans:2, topic:'comprension' },
        { id:'sm03', type:'mcq', q:'¿Qué palabra tiene 3 sílabas?',
          opts:['Sol','Casa','Mariposa','Pato'],                                                     ans:2, topic:'silabas'    },
        { id:'sm04', type:'mcq', q:'"La niña come una manzana." ¿Qué come?',
          opts:['Una pera','Una naranja','Una uva','Una manzana'],                                   ans:3, topic:'comprension' },
        { id:'sm05', type:'mcq', q:'¿Cuál sílaba falta? "MA-RI-__-SA"',
          opts:['PO','TO','SA','LA'],                                                                ans:0, topic:'silabas'    },
        { id:'sm06', type:'mcq', q:'"El cielo está nublado." ¿Cómo está el cielo?',
          opts:['Soleado','Despejado','Nublado','Estrellado'],                                       ans:2, topic:'comprension' },
        { id:'sm07', type:'mcq', q:'¿Qué palabra rima con "GATO"?',
          opts:['Casa','Pato','Silla','Mesa'],                                                       ans:1, topic:'vocabulario' },
        { id:'sm08', type:'mcq', q:'"CA-BA-LLO" — ¿cuántas sílabas?',
          opts:['2','3','4','5'],                                                                    ans:1, topic:'silabas'    },
        { id:'sm09', type:'image', q:'¿Cuál imagen es "ELEFANTE"?',
          opts:[{e:'🦁',l:'León'},{e:'🐯',l:'Tigre'},{e:'🐘',l:'Elefante'},{e:'🦒',l:'Jirafa'}],  ans:2, topic:'vocabulario' },
        { id:'sm10', type:'mcq', q:'"Juan tiene 5 manzanas. Come 2. ¿Cuántas quedan?"',
          opts:['2','3','4','5'],                                                                    ans:1, topic:'comprension' },
      ],
      hard: [
        { id:'sh01', type:'mcq', q:'"María estudia todos los días." ¿Qué hace María?',
          opts:['Juega','Come','Estudia','Duerme'],                                                  ans:2, topic:'comprension' },
        { id:'sh02', type:'mcq', q:'¿Cuál es el plural de "árbol"?',
          opts:['árboles','arbol','árbola','arboles'],                                               ans:0, topic:'gramatica'  },
        { id:'sh03', type:'mcq', q:'¿Qué significa "veloz"?',
          opts:['Grande','Rápido','Pesado','Suave'],                                                 ans:1, topic:'vocabulario'},
        { id:'sh04', type:'mcq', q:'"Llueve porque el cielo está nublado." ¿Por qué llueve?',
          opts:['Hace calor','Hay nubes','Es de noche','Hay viento'],                                ans:1, topic:'comprension' },
        { id:'sh05', type:'mcq', q:'¿Cuál de estas palabras es un verbo?',
          opts:['Árbol','Azul','Correr','Grande'],                                                   ans:2, topic:'gramatica'  },
        { id:'sh06', type:'mcq', q:'¿Cuál es el antónimo de "frío"?',
          opts:['Nieve','Caliente','Húmedo','Oscuro'],                                               ans:1, topic:'vocabulario'},
        { id:'sh07', type:'mcq', q:'"Los niños juegan en el jardín." ¿Dónde juegan?',
          opts:['En la escuela','En la casa','En el jardín','En el parque'],                         ans:2, topic:'comprension' },
        { id:'sh08', type:'mcq', q:'¿Qué palabra es un adjetivo?',
          opts:['Correr','Rápido','Perro','Comer'],                                                  ans:1, topic:'gramatica'  },
        { id:'sh09', type:'mcq', q:'¿Cuántas sílabas tiene "mariposa"?',
          opts:['3','4','5','2'],                                                                    ans:1, topic:'silabas'    },
        { id:'sh10', type:'mcq', q:'"Ana tiene 12 años. Su hermano tiene 4 menos." ¿Cuántos años tiene el hermano?',
          opts:['7','8','9','10'],                                                                   ans:1, topic:'comprension' },
      ],
    },
  },

  // ── Obtener siguiente pregunta ───────────────────────────
  getNextQuestion(subject, difficulty, usedIds = []) {
    const pool = this.questions[subject]?.[difficulty] || [];
    const available = pool.filter(q => !usedIds.includes(q.id));
    if (available.length === 0) {
      // Si no quedan en ese nivel, buscar en otros niveles
      const all = Object.values(this.questions[subject]).flat().filter(q => !usedIds.includes(q.id));
      return all.length ? all[Math.floor(Math.random() * all.length)] : null;
    }
    return available[Math.floor(Math.random() * available.length)];
  },

  // ── Ajustar dificultad ───────────────────────────────────
  adjustDifficulty(current, session) {
    const { consecutiveErrors, consecutiveCorrect, accuracy } = session;
    if (consecutiveErrors >= 3) {
      const down = { hard:'medium', medium:'easy', easy:'easy' };
      return { level: down[current], changed: current !== down[current], direction: 'down' };
    }
    if (consecutiveCorrect >= 3 && accuracy >= 80) {
      const up = { easy:'medium', medium:'hard', hard:'hard' };
      return { level: up[current], changed: current !== up[current], direction: 'up' };
    }
    return { level: current, changed: false, direction: null };
  },

  // ── Detectar patrón de error dominante ──────────────────
  detectErrorPattern(errorLog) {
    if (!errorLog || errorLog.length < 2) return null;
    const count = {};
    errorLog.forEach(e => { count[e.topic] = (count[e.topic] || 0) + 1; });
    const [topic, n] = Object.entries(count).sort((a,b) => b[1]-a[1])[0] || [];
    if (!topic || n < 2) return null;
    return { topic, count: n, pct: Math.round((n / errorLog.length) * 100) };
  },

  // ── Calcular riesgo académico ────────────────────────────
  calculateRisk(data) {
    let score = 0;
    const reasons = [];
    const { mathAcc, spanishAcc, avgTime, consecutiveErrors, sessionsWeek, errorPattern } = data;

    if (mathAcc < 50)    { score += 4; reasons.push('Precisión muy baja en Matemáticas (' + mathAcc + '%)'); }
    else if (mathAcc < 70){ score += 2; reasons.push('Dificultad en Matemáticas (' + mathAcc + '%)'); }

    if (spanishAcc < 50)    { score += 4; reasons.push('Precisión muy baja en Español (' + spanishAcc + '%)'); }
    else if (spanishAcc < 70){ score += 2; reasons.push('Dificultad en Español (' + spanishAcc + '%)'); }

    if (avgTime > 8)     { score += 3; reasons.push('Tiempo de respuesta muy alto (' + avgTime + 's)'); }
    else if (avgTime > 5){ score += 1; reasons.push('Tiempo elevado (' + avgTime + 's)'); }

    if (consecutiveErrors >= 5) { score += 3; reasons.push('Muchos errores seguidos (' + consecutiveErrors + ')'); }
    else if (consecutiveErrors >= 3) score += 1;

    if (!sessionsWeek || sessionsWeek === 0) { score += 3; reasons.push('Sin actividad esta semana'); }
    else if (sessionsWeek <= 2) { score += 1; reasons.push('Baja frecuencia de práctica'); }

    if (errorPattern && errorPattern.pct >= 60)
      { score += 2; reasons.push('Dificultad dominante en: ' + errorPattern.topic); }

    const level = score >= 8 ? 'alto' : score >= 4 ? 'medio' : 'bajo';
    const meta  = { alto:{ color:'#EF4444', emoji:'🔴', label:'Alto' },
                    medio:{ color:'#F59E0B', emoji:'🟡', label:'Medio' },
                    bajo:{ color:'#10B981', emoji:'🟢', label:'Bajo' } };
    return { level, score, reasons, ...meta[level] };
  },

  // ── Generar recomendaciones automáticas ─────────────────
  generateRecommendations(studentData, riskData) {
    const recs = [];
    const topicRecs = {
      restas:      { icon:'➖', title:'Refuerzo de Restas',       text:'Practica restas con objetos concretos. Empieza siempre con números menores a 10.',        action:'math',    diff:'easy'   },
      sumas:       { icon:'➕', title:'Refuerzo de Sumas',         text:'Repasa sumas básicas usando la técnica de contar hacia adelante con los dedos.',           action:'math',    diff:'easy'   },
      comprension: { icon:'📖', title:'Comprensión Lectora',       text:'Lee textos cortos en voz alta 15 min/día. Luego responde: ¿quién?, ¿qué pasó?, ¿dónde?',  action:'spanish', diff:'easy'   },
      silabas:     { icon:'🔤', title:'Práctica de Sílabas',       text:'Divide palabras palmoteando por sílabas. Usa palabras del ambiente cotidiano.',            action:'spanish', diff:'easy'   },
      vocabulario: { icon:'📝', title:'Vocabulario',               text:'Aprende 3 palabras nuevas al día con su imagen. Lee cuentos ilustrados.',                  action:'spanish', diff:'medium' },
      gramatica:   { icon:'✍️', title:'Gramática Básica',          text:'Identifica sustantivos y verbos en oraciones del día a día.',                              action:'spanish', diff:'medium' },
      letras:      { icon:'🔡', title:'Reconocimiento de Letras',  text:'Practica el alfabeto con canciones y asocia cada letra con una imagen familiar.',          action:'spanish', diff:'easy'   },
    };

    if (studentData.errorPattern) {
      const r = topicRecs[studentData.errorPattern.topic];
      if (r) recs.push({ ...r, priority:'alta', tag:'⚠️ Área crítica' });
    }
    if (riskData.level === 'alto')
      recs.push({ icon:'👨‍🏫', title:'Atención del Docente', text:'Se recomienda sesión personalizada con el docente para identificar la dificultad de raíz.', priority:'alta', tag:'🔴 Urgente' });
    if (studentData.avgTime > 5)
      recs.push({ icon:'⏱️', title:'Mejorar Velocidad', text:'Practica 5 min diarios con ejercicios cronometrados. La velocidad mejora con la constancia.', action:'math', diff:'easy', priority:'media', tag:'⏱️ Velocidad' });
    if ((studentData.sessionsWeek || 0) <= 2)
      recs.push({ icon:'📅', title:'Constancia Diaria', text:'Practica al menos 15 min cada día. La frecuencia es más importante que la duración de cada sesión.', priority:'media', tag:'📅 Hábito' });
    if (riskData.level === 'bajo' && recs.length === 0)
      recs.push({ icon:'🚀', title:'¡Sigue Avanzando!', text:'Tu desempeño es excelente. Intenta el nivel difícil para seguir creciendo.', action:'math', diff:'hard', priority:'baja', tag:'🌟 Reto' });

    return recs.slice(0, 3);
  },

  getDiagnosticQuestions() {
    return [
      this.questions.math.easy[0],    this.questions.math.easy[2],
      this.questions.math.medium[0],  this.questions.math.medium[2],
      this.questions.math.hard[0],    this.questions.math.hard[2],
      this.questions.spanish.easy[0], this.questions.spanish.easy[3],
      this.questions.spanish.medium[0],this.questions.spanish.medium[2],
      this.questions.spanish.hard[0], this.questions.spanish.hard[2],
    ];
  },
};