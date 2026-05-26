// src/components/features/SubjectCard/SubjectCard.jsx
import React from 'react';
import './SubjectCard.css';

const SubjectCard = ({
  subject,
  icon,
  description,
  level,
  progress,
  accuracy,
  exercisesCompleted,
  averageTime,
  onContinue,
  onViewDetails
}) => {
  const getLevelBadge = (level) => {
    const badges = {
      1: { emoji: '⭐', text: 'Nivel 1', class: 'nivel-1' },
      2: { emoji: '🚀', text: 'Nivel 2', class: 'nivel-2' },
      3: { emoji: '🌟', text: 'Nivel 3', class: 'nivel-3' }
    };
    return badges[level] || badges[1];
  };

  const badge = getLevelBadge(level);

  return (
    <div className={`subject-card subject-${subject.toLowerCase()}`}>
      <div className="subject-header">
        <div className="subject-title">
          <span className="subject-icon">{icon}</span>
          <div>
            <h3>{subject}</h3>
            <p className="subject-description">{description}</p>
          </div>
        </div>
        <span className={`level-badge ${badge.class}`}>
          {badge.emoji} {badge.text}
        </span>
      </div>

      <div className="subject-stats">
        <div className="stat-box">
          <div className="stat-value">{exercisesCompleted}</div>
          <div className="stat-label">Completados</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{accuracy}%</div>
          <div className="stat-label">Precisión</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{averageTime}</div>
          <div className="stat-label">Tiempo Prom.</div>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-header">
          <span className="progress-label">Progreso del Nivel</span>
          <span className="progress-value">{progress.current}/{progress.total}</span>
        </div>
        <div className="progress-bar">
          <div 
            className={`progress-fill ${subject.toLowerCase()}`}
            style={{ width: `${(progress.current / progress.total) * 100}%` }}
          />
        </div>
      </div>

      <div className="action-buttons">
        <button className="btn btn-primary" onClick={onContinue}>
          ▶ Continuar Aprendiendo
        </button>
        <button className="btn btn-secondary" onClick={onViewDetails}>
          📊 Ver Detalles
        </button>
      </div>
    </div>
  );
};

export default SubjectCard;
