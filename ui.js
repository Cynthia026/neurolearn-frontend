// ============================================================
// ui.js — Módulo UI v2.0
// Modales, toasts, achievement toasts
// ============================================================

const NLUI = {

  showModal(title, body, actions=[]) {
    this._rm();
    if (typeof _injectKeyframes === 'function') _injectKeyframes();
    
    const ov = document.createElement('div');
    ov.id = 'nl-modal';
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,0.6);backdrop-filter:blur(6px);z-index:9990;display:flex;align-items:center;justify-content:center;padding:1.5rem;animation:nlFadeIn 0.2s ease;';
    
    const modal = document.createElement('div');
    modal.style.cssText = 'background:white;border-radius:1.75rem;padding:2.5rem;max-width:480px;width:100%;box-shadow:0 25px 60px rgba(0,0,0,0.25);animation:nlSlideUp 0.3s cubic-bezier(0.34,1.56,0.64,1);';
    
    // Header
    const header = document.createElement('div');
    header.style.cssText = 'display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1.25rem;';
    header.innerHTML = `
      <h3 style="font-family:'Fredoka',sans-serif;font-size:1.5rem;color:#0F172A;margin:0;">${title}</h3>
      <button onclick="NLUI._rm()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;color:#94A3B8;line-height:1;">×</button>
    `;
    
    // Body
    const bodyEl = document.createElement('p');
    bodyEl.style.cssText = 'color:#64748B;line-height:1.7;white-space:pre-line;margin-bottom:1.75rem;';
    bodyEl.innerHTML = body;
    
    // Actions
    const actionsEl = document.createElement('div');
    actionsEl.style.cssText = 'display:flex;gap:0.75rem;';
    
    if (actions.length === 0) {
      // Default button
      const btn = document.createElement('button');
      btn.textContent = 'Entendido';
      btn.style.cssText = 'width:100%;padding:0.875rem;border:none;border-radius:999px;font-family:Fredoka,sans-serif;font-weight:600;font-size:1rem;cursor:pointer;background:linear-gradient(135deg,#667eea,#764ba2);color:white;';
      btn.onclick = () => this._rm();
      actionsEl.appendChild(btn);
    } else {
      actions.forEach((a, idx) => {
        const btn = document.createElement('button');
        btn.textContent = a.label;
        const isPrimary = a.primary !== undefined ? a.primary : (idx === actions.length - 1);
        btn.style.cssText = `padding:0.875rem 1.5rem;border:none;border-radius:999px;font-family:Fredoka,sans-serif;font-weight:600;font-size:1rem;cursor:pointer;flex:1;background:${isPrimary?'linear-gradient(135deg,#667eea,#764ba2)':'#F1F5F9'};color:${isPrimary?'white':'#334155'};transition:all 0.2s;`;
        
        // Handle both onclick (legacy) and action (new)
        if (a.action && typeof a.action === 'function') {
          btn.onclick = () => {
            a.action();
            this._rm();
          };
        } else if (a.onclick) {
          btn.onclick = () => {
            eval(a.onclick);
          };
        } else {
          btn.onclick = () => this._rm();
        }
        
        btn.onmouseover = () => {
          if (isPrimary) {
            btn.style.transform = 'translateY(-2px)';
            btn.style.boxShadow = '0 4px 12px rgba(102,126,234,0.4)';
          }
        };
        btn.onmouseout = () => {
          btn.style.transform = '';
          btn.style.boxShadow = '';
        };
        
        actionsEl.appendChild(btn);
      });
    }
    
    modal.appendChild(header);
    modal.appendChild(bodyEl);
    modal.appendChild(actionsEl);
    ov.appendChild(modal);
    
    ov.addEventListener('click', e => { if(e.target === ov) this._rm(); });
    document.body.appendChild(ov);
  },

  _rm() {
    const m = document.getElementById('nl-modal');
    if (m) { m.style.opacity='0'; m.style.transition='opacity 0.2s'; setTimeout(()=>m.remove(),200); }
  },

  showAchievement(icon, name, desc) {
    this.showModal(`${icon} Logro Desbloqueado`, `🏆 ${name}\n\n${desc}\n\n¡Sigue practicando para desbloquear más logros!`);
  },

  showLockedAchievement(icon, name, req) {
    this.showModal(`🔒 ${name}`, `Este logro aún está bloqueado.\n\n📋 Requisito: ${req}\n\n¡Practica más para desbloquearlo!`, [
      { label:'💪 ¡A practicar!', onclick:`NLUI._rm();window.location.href='exercise-interface.html'`, primary:true },
      { label:'Cerrar', onclick:'NLUI._rm()', primary:false },
    ]);
  },

  // Toast de logro flotante (aparece después de terminar un ejercicio)
  showAchievementToast(icon, name, desc) {
    _injectKeyframes();
    const t = document.createElement('div');
    t.style.cssText = 'position:fixed;bottom:2rem;right:2rem;z-index:9999;background:white;border-radius:1.25rem;padding:1.25rem 1.5rem;box-shadow:0 10px 40px rgba(0,0,0,0.15);display:flex;gap:1rem;align-items:center;max-width:320px;animation:nlSlideUp 0.4s cubic-bezier(0.34,1.56,0.64,1);border-left:4px solid #7C3AED;';
    t.innerHTML = `<div style="font-size:2.5rem;">${icon}</div><div><div style="font-family:'Fredoka',sans-serif;font-size:0.75rem;color:#7C3AED;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">¡Logro Desbloqueado!</div><div style="font-family:'Fredoka',sans-serif;font-size:1rem;font-weight:700;color:#0F172A;">${name}</div><div style="font-size:0.78rem;color:#64748B;">${desc}</div></div>`;
    document.body.appendChild(t);
    setTimeout(() => { t.style.opacity='0'; t.style.transition='opacity 0.4s'; setTimeout(()=>t.remove(),400); }, 4000);
  },

  showAlerts() {
    const notifs = NLState.student.notifications.filter(n => n.type !== 'achievement');
    const html = notifs.length ? notifs.map(n =>
      `<div style="padding:0.875rem;background:#F8FAFC;border-radius:1rem;margin-bottom:0.5rem;font-size:0.85rem;">${JSON.stringify(n)}</div>`
    ).join('') : '<p style="color:#64748B;text-align:center;padding:1rem;">✅ Sin notificaciones nuevas</p>';
    this.showModal('🔔 Notificaciones', ' ');
    setTimeout(()=>{ const p=document.querySelector('#nl-modal p'); if(p) p.innerHTML=html; },30);
  },

  confirmLogout() {
    this.showModal(
      '🚪 Cerrar Sesión',
      '¿Seguro que deseas salir? Tu progreso está guardado.',
      [
        { label: 'Cancelar', action: null },
        { label: 'Sí, salir', primary: true, action: () => {
            if (typeof NLAuth !== 'undefined' && NLAuth.logout) {
              NLAuth.logout();
            } else {
              // Fallback si NLAuth no está disponible
              NLState.clearSession();
              window.location.href = 'landing-page.html';
            }
          }
        }
      ]
    );
  },

  acceptChallenge() {
    const already = sessionStorage.getItem('challenge_done');
    if (already) { this.showModal('🎯 Reto en curso','Ya aceptaste el reto de hoy. ¡Sigue practicando!'); return; }
    sessionStorage.setItem('challenge_done','1');
    this.showModal('🎯 ¡Reto Aceptado!','Meta: Completa 5 ejercicios sin errores.\n\n⭐ Recompensa: +200 puntos extra\n⏰ Tiempo: hoy antes de las 23:59\n\n¿Con qué materia empiezas?',[
      { label:'🔢 Matemáticas', onclick:`NLUI._rm();NLState.exercise.subject='math';window.location.href='exercise-interface.html'`, primary:true },
      { label:'📚 Español',     onclick:`NLUI._rm();NLState.exercise.subject='spanish';window.location.href='exercise-interface.html'`, primary:false },
    ]);
  },

  switchChartTab(period, btn) {
    document.querySelectorAll('.ctab').forEach(b=>b.classList.remove('active'));
    if(btn) btn.classList.add('active');
    const lbl={week:'Semana actual',month:'Último mes',quarter:'Último trimestre'};
    NLRouter._showToast('📊 Mostrando: ' + (lbl[period]||period), 'info');
  },

  filterTable(subject, btn) {
    NLPageTeacher.filterTable(subject, btn);
    const lbl={all:'todos los alumnos',math:'Matemáticas',spanish:'Español'};
    NLRouter._showToast('📋 Filtrado por ' + (lbl[subject]||subject), 'info');
  },
};