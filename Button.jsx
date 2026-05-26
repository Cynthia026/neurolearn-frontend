// src/components/common/Button/Button.jsx
import React from 'react';
import './Button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  icon,
  onClick,
  disabled = false,
  fullWidth = false,
  ...props 
}) => {
  const classNames = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth && 'btn-full-width',
    disabled && 'btn-disabled'
  ].filter(Boolean).join(' ');

  return (
    <button 
      className={classNames}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      <span className="btn-text">{children}</span>
    </button>
  );
};

export default Button;
