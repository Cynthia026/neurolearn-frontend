/**
 * NeuroLearn Theme System
 * Sistema de temas claro/oscuro con persistencia
 */

const NLTheme = {
    currentTheme: 'light',
    
    init() {
        // Load saved theme
        const saved = localStorage.getItem('nl_theme');
        if (saved) {
            this.currentTheme = saved;
        } else {
            // Check system preference
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                this.currentTheme = 'dark';
            }
        }

        // Apply theme
        this.applyTheme(this.currentTheme);

        // Inject CSS
        this.injectCSS();

        // Create toggle button if not exists
        this.createToggleButton();

        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
                const newTheme = e.matches ? 'dark' : 'light';
                this.setTheme(newTheme);
            });
        }
    },

    injectCSS() {
        if (document.getElementById('nl-theme-css')) return;

        const style = document.createElement('style');
        style.id = 'nl-theme-css';
        style.textContent = `
            :root {
                /* Light theme (default) */
                --bg-primary: #FFFFFF;
                --bg-secondary: #F8FAFC;
                --bg-tertiary: #F1F5F9;
                --text-primary: #0F172A;
                --text-secondary: #64748B;
                --text-tertiary: #94A3B8;
                --border-color: #E2E8F0;
                --shadow: rgba(0,0,0,0.1);
                --shadow-lg: rgba(0,0,0,0.15);
            }

            [data-theme="dark"] {
                /* Dark theme */
                --bg-primary: #0F172A;
                --bg-secondary: #1E293B;
                --bg-tertiary: #334155;
                --text-primary: #F8FAFC;
                --text-secondary: #CBD5E1;
                --text-tertiary: #94A3B8;
                --border-color: #334155;
                --shadow: rgba(0,0,0,0.3);
                --shadow-lg: rgba(0,0,0,0.5);
            }

            /* Apply theme variables */
            body {
                background: var(--bg-secondary);
                color: var(--text-primary);
                transition: background-color 0.3s ease, color 0.3s ease;
            }

            /* Cards and containers */
            .card, .section, .modal, .sidebar, 
            .dashboard-card, .widget, .panel {
                background: var(--bg-primary);
                color: var(--text-primary);
                border-color: var(--border-color);
                transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
            }

            /* Text colors */
            h1, h2, h3, h4, h5, h6 {
                color: var(--text-primary);
            }

            p, span, div {
                color: var(--text-primary);
            }

            .text-secondary, .subtitle, .description {
                color: var(--text-secondary);
            }

            .text-muted, .hint, .placeholder {
                color: var(--text-tertiary);
            }

            /* Borders */
            hr, .divider, .border {
                border-color: var(--border-color);
            }

            /* Inputs */
            input, textarea, select {
                background: var(--bg-primary);
                color: var(--text-primary);
                border-color: var(--border-color);
            }

            input::placeholder, textarea::placeholder {
                color: var(--text-tertiary);
            }

            /* Shadows */
            .shadow {
                box-shadow: 0 4px 20px var(--shadow);
            }

            .shadow-lg {
                box-shadow: 0 10px 40px var(--shadow-lg);
            }

            /* Theme toggle button */
            .nl-theme-toggle {
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                width: 56px;
                height: 56px;
                border-radius: 50%;
                background: var(--bg-primary);
                border: 2px solid var(--border-color);
                box-shadow: 0 4px 20px var(--shadow-lg);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
                cursor: pointer;
                z-index: 999;
                transition: all 0.3s ease;
            }

            .nl-theme-toggle:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 30px var(--shadow-lg);
            }

            .nl-theme-toggle:active {
                transform: scale(0.95);
            }

            /* Dark mode specific adjustments for gradients */
            [data-theme="dark"] .gradient-bg {
                opacity: 0.8;
            }

            /* Preserve colored elements */
            .btn-primary, .badge, .alert, .tag {
                /* These keep their original colors */
            }

            /* Smooth transitions */
            * {
                transition-property: background-color, color, border-color;
                transition-duration: 0.3s;
                transition-timing-function: ease;
            }

            /* Override for elements that shouldn't transition */
            img, video, canvas, svg {
                transition: none !important;
            }
        `;
        document.head.appendChild(style);
    },

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        localStorage.setItem('nl_theme', theme);

        // Update toggle button icon
        const toggle = document.getElementById('nl-theme-toggle');
        if (toggle) {
            toggle.textContent = theme === 'dark' ? '☀️' : '🌙';
            toggle.setAttribute('title', theme === 'dark' ? 'Modo claro' : 'Modo oscuro');
        }

        // Emit event for other components
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    },

    setTheme(theme) {
        this.applyTheme(theme);
        
        // Show toast notification
        if (typeof NLNotifications !== 'undefined') {
            NLNotifications.info(
                `Cambiado a modo ${theme === 'dark' ? 'oscuro' : 'claro'}`,
                null,
                2000
            );
        }
    },

    toggle() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    },

    createToggleButton() {
        // Check if already exists
        if (document.getElementById('nl-theme-toggle')) return;

        const button = document.createElement('button');
        button.id = 'nl-theme-toggle';
        button.className = 'nl-theme-toggle';
        button.textContent = this.currentTheme === 'dark' ? '☀️' : '🌙';
        button.setAttribute('title', this.currentTheme === 'dark' ? 'Modo claro' : 'Modo oscuro');
        button.setAttribute('aria-label', 'Cambiar tema');
        button.onclick = () => this.toggle();

        document.body.appendChild(button);
    },

    getTheme() {
        return this.currentTheme;
    },

    isDark() {
        return this.currentTheme === 'dark';
    },

    isLight() {
        return this.currentTheme === 'light';
    }
};

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => NLTheme.init());
} else {
    NLTheme.init();
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NLTheme;
}