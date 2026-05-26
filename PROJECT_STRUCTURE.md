# 🚀 NeuroLearn Kids - Estructura del Proyecto

## 📁 Estructura de Carpetas

```
neurolearn-kids/
│
├── frontend/                           # Aplicación React
│   ├── public/
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   └── assets/
│   │       ├── images/
│   │       └── icons/
│   │
│   ├── src/
│   │   ├── components/                 # Componentes reutilizables
│   │   │   ├── common/                 # Componentes compartidos
│   │   │   │   ├── Button/
│   │   │   │   │   ├── Button.jsx
│   │   │   │   │   └── Button.css
│   │   │   │   ├── Card/
│   │   │   │   ├── Badge/
│   │   │   │   ├── ProgressBar/
│   │   │   │   └── Avatar/
│   │   │   │
│   │   │   ├── layout/                 # Componentes de layout
│   │   │   │   ├── Navbar/
│   │   │   │   ├── Sidebar/
│   │   │   │   ├── Header/
│   │   │   │   └── Footer/
│   │   │   │
│   │   │   └── features/               # Componentes específicos
│   │   │       ├── SubjectCard/
│   │   │       ├── AchievementBadge/
│   │   │       ├── StudentTable/
│   │   │       └── AlertCard/
│   │   │
│   │   ├── pages/                      # Páginas principales
│   │   │   ├── Landing/
│   │   │   │   └── LandingPage.jsx
│   │   │   │
│   │   │   ├── Auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Register.jsx
│   │   │   │   └── ForgotPassword.jsx
│   │   │   │
│   │   │   ├── Student/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Exercise.jsx
│   │   │   │   ├── Evaluation.jsx
│   │   │   │   └── Progress.jsx
│   │   │   │
│   │   │   ├── Teacher/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Students.jsx
│   │   │   │   ├── Reports.jsx
│   │   │   │   └── Content.jsx
│   │   │   │
│   │   │   └── Parent/
│   │   │       ├── Dashboard.jsx
│   │   │       └── StudentProgress.jsx
│   │   │
│   │   ├── hooks/                      # Custom React hooks
│   │   │   ├── useAuth.js
│   │   │   ├── useStudent.js
│   │   │   ├── useProgress.js
│   │   │   └── useAdaptive.js
│   │   │
│   │   ├── context/                    # Context providers
│   │   │   ├── AuthContext.jsx
│   │   │   ├── ThemeContext.jsx
│   │   │   └── StudentContext.jsx
│   │   │
│   │   ├── services/                   # API services
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── studentService.js
│   │   │   └── adaptiveService.js
│   │   │
│   │   ├── utils/                      # Utilidades
│   │   │   ├── constants.js
│   │   │   ├── helpers.js
│   │   │   └── validators.js
│   │   │
│   │   ├── styles/                     # Estilos globales
│   │   │   ├── globals.css
│   │   │   ├── variables.css
│   │   │   └── animations.css
│   │   │
│   │   ├── App.jsx                     # Componente principal
│   │   ├── App.css
│   │   └── index.js                    # Entry point
│   │
│   ├── package.json
│   └── README.md
│
├── backend/                            # API con FastAPI
│   ├── app/
│   │   ├── __init__.py
│   │   │
│   │   ├── api/                        # Endpoints
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── students.py
│   │   │   ├── exercises.py
│   │   │   ├── evaluations.py
│   │   │   └── analytics.py
│   │   │
│   │   ├── models/                     # Modelos de BD
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── student.py
│   │   │   ├── exercise.py
│   │   │   ├── evaluation.py
│   │   │   └── progress.py
│   │   │
│   │   ├── schemas/                    # Pydantic schemas
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── student.py
│   │   │   └── exercise.py
│   │   │
│   │   ├── services/                   # Lógica de negocio
│   │   │   ├── __init__.py
│   │   │   ├── auth_service.py
│   │   │   ├── adaptive_engine.py
│   │   │   ├── analytics_service.py
│   │   │   └── ml_service.py
│   │   │
│   │   ├── ml/                         # Modelos de IA
│   │   │   ├── __init__.py
│   │   │   ├── difficulty_classifier.py
│   │   │   ├── pattern_detector.py
│   │   │   └── risk_predictor.py
│   │   │
│   │   ├── core/                       # Configuraciones
│   │   │   ├── __init__.py
│   │   │   ├── config.py
│   │   │   ├── database.py
│   │   │   └── security.py
│   │   │
│   │   └── main.py                     # FastAPI app
│   │
│   ├── tests/                          # Tests
│   │   ├── test_api/
│   │   ├── test_models/
│   │   └── test_ml/
│   │
│   ├── requirements.txt
│   └── README.md
│
├── database/                           # Scripts de BD
│   ├── migrations/
│   ├── seeds/
│   └── schema.sql
│
├── docs/                               # Documentación
│   ├── API.md
│   ├── ARCHITECTURE.md
│   ├── DESIGN_SYSTEM.md
│   └── USER_GUIDE.md
│
├── .gitignore
├── docker-compose.yml
└── README.md
```

## 🎯 Componentes Clave por Rol

### 👦 Estudiante
- **Dashboard**: Vista principal con progreso y materias
- **Exercise**: Interfaz de ejercicios adaptativos
- **Evaluation**: Evaluación diagnóstica
- **Achievements**: Sistema de logros y recompensas

### 👨‍🏫 Docente
- **Dashboard**: Métricas y estadísticas grupales
- **StudentList**: Tabla con desempeño individual
- **Reports**: Generación de reportes
- **ContentManager**: Gestión de ejercicios

### 👪 Padres
- **ChildProgress**: Seguimiento del progreso del hijo
- **Reports**: Reportes simplificados
- **Settings**: Configuración de notificaciones

## 🛠 Stack Tecnológico

### Frontend
- **React 18** - Framework principal
- **React Router** - Navegación
- **Axios** - HTTP client
- **Chart.js / Recharts** - Gráficas
- **Framer Motion** - Animaciones
- **CSS Modules / Styled Components** - Estilos

### Backend
- **FastAPI** - Framework web
- **SQLAlchemy** - ORM
- **PostgreSQL** - Base de datos
- **Pydantic** - Validación de datos
- **scikit-learn** - Machine Learning
- **JWT** - Autenticación

### DevOps
- **Docker** - Containerización
- **Nginx** - Reverse proxy
- **GitHub Actions** - CI/CD

## 📦 Instalación

### Frontend
```bash
cd frontend
npm install
npm start
```

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Database
```bash
docker-compose up -d postgres
```

## 🎨 Variables CSS Globales

```css
:root {
    /* Colores Primarios */
    --primary-purple: #7C3AED;
    --primary-blue: #3B82F6;
    --primary-pink: #EC4899;
    --primary-cyan: #06B6D4;
    
    /* Colores de Estado */
    --success-green: #10B981;
    --warning-yellow: #FBBF24;
    --danger-red: #EF4444;
    
    /* Neutrales */
    --neutral-50: #F8FAFC;
    --neutral-900: #0F172A;
    
    /* Tipografía */
    --font-display: 'Fredoka', sans-serif;
    --font-body: 'DM Sans', sans-serif;
    
    /* Espaciado */
    --space-xs: 0.25rem;
    --space-sm: 0.5rem;
    --space-md: 1rem;
    --space-lg: 1.5rem;
    --space-xl: 2rem;
    
    /* Sombras */
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    
    /* Bordes */
    --radius-sm: 0.5rem;
    --radius-md: 0.75rem;
    --radius-lg: 1rem;
    --radius-full: 9999px;
}
```

## 🔄 Flujo de Navegación

```
Landing Page
    ↓
Login/Register
    ↓
    ├── Student Dashboard
    │       ↓
    │   Exercise Interface
    │       ↓
    │   Progress View
    │
    ├── Teacher Dashboard
    │       ↓
    │   Student Management
    │       ↓
    │   Reports & Analytics
    │
    └── Parent Dashboard
            ↓
        Child Progress View
```

## 🚀 Próximos Pasos

1. **Fase 1**: Implementar autenticación y roles
2. **Fase 2**: Desarrollar motor adaptativo
3. **Fase 3**: Crear interfaz de ejercicios
4. **Fase 4**: Implementar sistema de analytics
5. **Fase 5**: Pruebas y optimización
