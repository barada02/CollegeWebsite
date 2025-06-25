import React from 'react';
import './Button.css';

interface ButtonProps {
  variant?: 'college' | 'admin';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'college', 
  size = 'md',
  children, 
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  ...props 
}) => {
  const classes = `btn btn-${variant} btn-${size} ${className}`.trim();
  
  return (
    <button 
      className={classes}
      onClick={onClick}
      type={type}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
