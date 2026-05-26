// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Pages
import LandingPage from './pages/Landing/LandingPage';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Student Pages
import StudentDashboard from './pages/Student/Dashboard';
import Exercise from './pages/Student/Exercise';
import Evaluation from './pages/Student/Evaluation';
import Progress from './pages/Student/Progress';

// Teacher Pages
import TeacherDashboard from './pages/Teacher/Dashboard';
import Students from './pages/Teacher/Students';
import Reports from './pages/Teacher/Reports';
import Content from './pages/Teacher/Content';

// Parent Pages
import ParentDashboard from './pages/Parent/Dashboard';
import StudentProgress from './pages/Parent/StudentProgress';

// Components
import ProtectedRoute from './components/common/ProtectedRoute';

import './styles/globals.css';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Student Routes */}
              <Route
                path="/student"
                element={
                  <ProtectedRoute role="student">
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/exercise/:subjectId"
                element={
                  <ProtectedRoute role="student">
                    <Exercise />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/evaluation"
                element={
                  <ProtectedRoute role="student">
                    <Evaluation />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/progress"
                element={
                  <ProtectedRoute role="student">
                    <Progress />
                  </ProtectedRoute>
                }
              />

              {/* Teacher Routes */}
              <Route
                path="/teacher"
                element={
                  <ProtectedRoute role="teacher">
                    <TeacherDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teacher/students"
                element={
                  <ProtectedRoute role="teacher">
                    <Students />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teacher/reports"
                element={
                  <ProtectedRoute role="teacher">
                    <Reports />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teacher/content"
                element={
                  <ProtectedRoute role="teacher">
                    <Content />
                  </ProtectedRoute>
                }
              />

              {/* Parent Routes */}
              <Route
                path="/parent"
                element={
                  <ProtectedRoute role="parent">
                    <ParentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/parent/student/:studentId"
                element={
                  <ProtectedRoute role="parent">
                    <StudentProgress />
                  </ProtectedRoute>
                }
              />

              {/* 404 */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
