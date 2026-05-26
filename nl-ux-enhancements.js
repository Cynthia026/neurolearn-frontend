/**
 * NeuroLearn Complete UX Enhancement System
 * Includes: Backup/Restore, Tutorial, Confetti, Sounds, Animations, Google Calendar
 */

// ==================================
// 1. BACKUP & RESTORE SYSTEM
// ==================================

const NLBackup = {
    exportAllData() {
        const data = {
            version: '1.0.0',
            timestamp: new Date().toISOString(),
            user: JSON.parse(localStorage.getItem('nl_session') || '{}'),
            notifications: JSON.parse(localStorage.getItem('nl_notifications') || '[]'),
            theme: localStorage.getItem('nl_theme') || 'light',
            progress: {
                exercises: JSON.parse(localStorage.getItem('exercises_completed') || '0'),
                points: JSON.parse(localStorage.getItem('total_points') || '0'),
                streak: JSON.parse(localStorage.getItem('current_streak') || '0')
            },
            games: {
                mathBlaster: JSON.parse(localStorage.getItem('math_blaster_stats') || '{}'),
                wordBuilder: JSON.parse(localStorage.getItem('word_builder_stats') || '{}'),
                memoryMatch: JSON.parse(localStorage.getItem('memory_match_stats') || '{}')
            },
            achievements: JSON.parse(localStorage.getItem('achievements') || '[]')
        };
        
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `neurolearn-backup-${Date.now()}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        
        if (typeof NLNotifications !== 'undefined') {
            NLNotifications.success('Datos exportados correctamente', 'Backup Completo');
        }
        
        return data;
    },
    
    importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    // Validate data
                    if (!data.version || !data.timestamp) {
                        throw new Error('Archivo inválido');
                    }
                    
                    // Restore data
                    if (data.user) localStorage.setItem('nl_session', JSON.stringify(data.user));
                    if (data.notifications) localStorage.setItem('nl_notifications', JSON.stringify(data.notifications));
                    if (data.theme) localStorage.setItem('nl_theme', data.theme);
                    if (data.progress) {
                        localStorage.setItem('exercises_completed', data.progress.exercises || '0');
                        localStorage.setItem('total_points', data.progress.points || '0');
                        localStorage.setItem('current_streak', data.progress.streak || '0');
                    }
                    if (data.games) {
                        Object.keys(data.games).forEach(game => {
                            localStorage.setItem(`${game}_stats`, JSON.stringify(data.games[game]));
                        });
                    }
                    if (data.achievements) {
                        localStorage.setItem('achievements', JSON.stringify(data.achievements));
                    }
                    
                    if (typeof NLNotifications !== 'undefined') {
                        NLNotifications.success('Datos importados correctamente. Recargando...', 'Importación Exitosa');
                    }
                    
                    setTimeout(() => window.location.reload(), 2000);
                    resolve(data);
                } catch (error) {
                    if (typeof NLNotifications !== 'undefined') {
                        NLNotifications.error('Error al importar: ' + error.message, 'Error');
                    }
                    reject(error);
                }
            };
            reader.readAsText(file);
        });
    },
    
    addBackupButtons() {
        const buttons = `
            <div style="display: flex; gap: 1rem; margin: 2rem 0;">
                <button onclick="NLBackup.exportAllData()" style="padding: 1rem 2rem; background: #10B981; color: white; border: none; border-radius: 0.5rem; font-weight: 700; cursor: pointer;">
                    📥 Exportar Datos
                </button>
                <label style="padding: 1rem 2rem; background: #7C3AED; color: white; border-radius: 0.5rem; font-weight: 700; cursor: pointer;">
                    📤 Importar Datos
                    <input type="file" accept=".json" onchange="NLBackup.importData(this.files[0])" style="display: none;">
                </label>
            </div>
        `;
        return buttons;
    }
};

// ==================================
// 2. INTERACTIVE TUTORIAL SYSTEM
// ==================================

const NLTutorial = {
    steps: [],
    currentStep: 0,
    overlay: null,
    tooltip: null,
    
    init(steps) {
        this.steps = steps;
        
        // Check if tutorial already completed
        if (localStorage.getItem('tutorial_completed')) {
            return false;
        }
        
        this.createOverlay();
        this.showStep(0);
        return true;
    },
    
    createOverlay() {
        // Dark overlay
        this.overlay = document.createElement('div');
        this.overlay.id = 'nl-tutorial-overlay';
        this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            z-index: 9998;
            animation: fadeIn 0.3s;
        `;
        document.body.appendChild(this.overlay);
        
        // Tooltip
        this.tooltip = document.createElement('div');
        this.tooltip.id = 'nl-tutorial-tooltip';
        this.tooltip.style.cssText = `
            position: fixed;
            background: white;
            padding: 1.5rem;
            border-radius: 1rem;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            z-index: 9999;
            max-width: 400px;
            animation: slideInUp 0.3s;
        `;
        document.body.appendChild(this.tooltip);
    },
    
    showStep(index) {
        if (index >= this.steps.length) {
            this.complete();
            return;
        }
        
        const step = this.steps[index];
        this.currentStep = index;
        
        // Highlight element
        const element = document.querySelector(step.element);
        if (element) {
            const rect = element.getBoundingClientRect();
            
            // Position highlight
            this.overlay.innerHTML = `
                <div style="position: absolute; top: ${rect.top - 10}px; left: ${rect.left - 10}px; 
                     width: ${rect.width + 20}px; height: ${rect.height + 20}px; 
                     border: 3px solid #7C3AED; border-radius: 0.5rem; background: rgba(255,255,255,0.1);
                     animation: pulse 2s infinite;"></div>
            `;
            
            // Position tooltip
            this.tooltip.style.top = (rect.bottom + 20) + 'px';
            this.tooltip.style.left = (rect.left) + 'px';
        }
        
        // Tooltip content
        this.tooltip.innerHTML = `
            <h3 style="font-family: Fredoka; color: #1E293B; margin-bottom: 0.5rem;">
                ${step.title}
            </h3>
            <p style="color: #64748B; margin-bottom: 1rem; line-height: 1.6;">
                ${step.description}
            </p>
            <div style="display: flex; gap: 1rem; justify-content: space-between;">
                <button onclick="NLTutorial.skip()" style="padding: 0.5rem 1rem; background: #F1F5F9; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 600;">
                    Saltar Tutorial
                </button>
                <div style="display: flex; gap: 0.5rem;">
                    ${index > 0 ? '<button onclick="NLTutorial.prev()" style="padding: 0.5rem 1rem; background: #E2E8F0; border: none; border-radius: 0.5rem; cursor: pointer;">← Anterior</button>' : ''}
                    <button onclick="NLTutorial.next()" style="padding: 0.5rem 1.5rem; background: #7C3AED; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 700;">
                        ${index === this.steps.length - 1 ? 'Finalizar' : 'Siguiente →'}
                    </button>
                </div>
            </div>
            <div style="margin-top: 1rem; text-align: center; color: #94A3B8; font-size: 0.85rem;">
                Paso ${index + 1} de ${this.steps.length}
            </div>
        `;
    },
    
    next() {
        this.showStep(this.currentStep + 1);
    },
    
    prev() {
        this.showStep(this.currentStep - 1);
    },
    
    skip() {
        if (confirm('¿Estás seguro de que quieres saltar el tutorial?')) {
            this.complete();
        }
    },
    
    complete() {
        localStorage.setItem('tutorial_completed', 'true');
        if (this.overlay) this.overlay.remove();
        if (this.tooltip) this.tooltip.remove();
        
        if (typeof NLNotifications !== 'undefined') {
            NLNotifications.success('¡Tutorial completado!', '¡Bienvenido!');
        }
    }
};

// ==================================
// 3. CONFETTI CELEBRATIONS
// ==================================

const NLConfetti = {
    celebrate(type = 'default') {
        const count = type === 'mega' ? 200 : 100;
        const duration = type === 'mega' ? 5000 : 3000;
        
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                this.createConfetti();
            }, Math.random() * duration);
        }
    },
    
    createConfetti() {
        const confetti = document.createElement('div');
        confetti.textContent = ['🎉', '⭐', '🌟', '✨', '🎊'][Math.floor(Math.random() * 5)];
        confetti.style.cssText = `
            position: fixed;
            top: -50px;
            left: ${Math.random() * 100}%;
            font-size: ${Math.random() * 20 + 20}px;
            z-index: 10000;
            pointer-events: none;
            animation: confettiFall ${Math.random() * 2 + 2}s linear forwards;
            transform: rotate(${Math.random() * 360}deg);
        `;
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 4000);
    },
    
    achievementUnlock(emoji, name) {
        this.celebrate();
        
        if (typeof NLNotifications !== 'undefined') {
            NLNotifications.success(`Logro desbloqueado: ${name}`, emoji + ' ¡Felicidades!', 5000);
        }
        
        this.playSound('achievement');
    }
};

// Confetti animation CSS (add to page)
if (!document.getElementById('confetti-style')) {
    const style = document.createElement('style');
    style.id = 'confetti-style';
    style.textContent = `
        @keyframes confettiFall {
            to {
                top: 100vh;
                transform: translateX(${Math.random() * 200 - 100}px) rotate(${Math.random() * 720}deg);
            }
        }
        @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.8; }
        }
        @keyframes slideInUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

// ==================================
// 4. ENHANCED SOUND SYSTEM
// ==================================

const NLSounds = {
    context: null,
    
    init() {
        this.context = new (window.AudioContext || window.webkitAudioContext)();
    },
    
    play(type) {
        if (!this.context) this.init();
        
        const sounds = {
            correct: { freq: 800, duration: 0.3, type: 'sine' },
            wrong: { freq: 200, duration: 0.4, type: 'sawtooth' },
            click: { freq: 500, duration: 0.1, type: 'sine' },
            achievement: { freq: [523, 659, 784], duration: 0.5, type: 'sine' }, // C-E-G chord
            notification: { freq: 600, duration: 0.2, type: 'triangle' },
            success: { freq: 880, duration: 0.4, type: 'sine' },
            level: { freq: [392, 494, 587, 698], duration: 0.3, type: 'sine' } // G-B-D-F chord
        };
        
        const sound = sounds[type];
        if (!sound) return;
        
        if (Array.isArray(sound.freq)) {
            // Play chord
            sound.freq.forEach((freq, i) => {
                setTimeout(() => {
                    this.playTone(freq, sound.duration, sound.type);
                }, i * 100);
            });
        } else {
            this.playTone(sound.freq, sound.duration, sound.type);
        }
    },
    
    playTone(frequency, duration, type = 'sine') {
        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0.3, this.context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);
        
        oscillator.start(this.context.currentTime);
        oscillator.stop(this.context.currentTime + duration);
    }
};

// ==================================
// 5. PAGE TRANSITIONS
// ==================================

const NLTransitions = {
    enable() {
        // Add transition styles
        if (!document.getElementById('page-transitions')) {
            const style = document.createElement('style');
            style.id = 'page-transitions';
            style.textContent = `
                body {
                    animation: fadeIn 0.5s ease;
                }
                .page-exit {
                    animation: fadeOut 0.3s ease forwards;
                }
                @keyframes fadeOut {
                    to { opacity: 0; transform: scale(0.95); }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Intercept navigation
        document.querySelectorAll('a[href]').forEach(link => {
            if (!link.hasAttribute('data-no-transition')) {
                link.addEventListener('click', (e) => {
                    if (link.href.startsWith(window.location.origin)) {
                        e.preventDefault();
                        document.body.classList.add('page-exit');
                        setTimeout(() => {
                            window.location.href = link.href;
                        }, 300);
                    }
                });
            }
        });
    }
};

// ==================================
// 6. GOOGLE CALENDAR INTEGRATION
// ==================================

const NLCalendar = {
    CLIENT_ID: 'YOUR_CLIENT_ID_HERE',
    API_KEY: 'YOUR_API_KEY_HERE',
    DISCOVERY_DOCS: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
    SCOPES: 'https://www.googleapis.com/auth/calendar.events',
    
    async init() {
        try {
            await gapi.load('client:auth2');
            await gapi.client.init({
                apiKey: this.API_KEY,
                clientId: this.CLIENT_ID,
                discoveryDocs: this.DISCOVERY_DOCS,
                scope: this.SCOPES
            });
            return true;
        } catch (error) {
            console.error('Calendar init error:', error);
            return false;
        }
    },
    
    async addEvent(title, date, description = '') {
        try {
            // Check if signed in
            if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
                await gapi.auth2.getAuthInstance().signIn();
            }
            
            const event = {
                summary: title,
                description: description,
                start: {
                    dateTime: date.toISOString(),
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                },
                end: {
                    dateTime: new Date(date.getTime() + 3600000).toISOString(),
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                },
                reminders: {
                    useDefault: false,
                    overrides: [
                        { method: 'popup', minutes: 30 }
                    ]
                }
            };
            
            const response = await gapi.client.calendar.events.insert({
                calendarId: 'primary',
                resource: event
            });
            
            if (typeof NLNotifications !== 'undefined') {
                NLNotifications.success('Evento agregado a Google Calendar', 'Calendario Actualizado');
            }
            
            return response.result;
        } catch (error) {
            console.error('Add event error:', error);
            if (typeof NLNotifications !== 'undefined') {
                NLNotifications.error('Error al agregar evento', 'Error');
            }
            return null;
        }
    },
    
    createButton(title, date, description) {
        return `
            <button onclick="NLCalendar.addEvent('${title}', new Date('${date}'), '${description}')" 
                    style="padding: 0.75rem 1.5rem; background: #4285F4; color: white; border: none; 
                           border-radius: 0.5rem; cursor: pointer; font-weight: 600; display: flex; 
                           align-items: center; gap: 0.5rem;">
                <span>📅</span>
                <span>Agregar a Calendar</span>
            </button>
        `;
    }
};

// ==================================
// AUTO-INITIALIZE
// ==================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        NLSounds.init();
        NLTransitions.enable();
    });
} else {
    NLSounds.init();
    NLTransitions.enable();
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NLBackup, NLTutorial, NLConfetti, NLSounds, NLTransitions, NLCalendar };
}