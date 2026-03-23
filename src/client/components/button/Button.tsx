// это файл 'Button.tsx
// расположен по адресу src/client/components/button/Button.tsx

import React from 'react';
import styles from './Button.module.scss';

interface ButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void; 
  children: React.ReactNode;
  type?: "button" | "submit";
  color?: "blue" | "red" | "gray" | "transparent";  // Типизируем для безопасности
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  children, 
  type = "button", 
  color = "blue",
  disabled = false 
}) => {
  // Динамически выбираем класс из модуля
  const buttonClass = `${styles.glassButton} ${styles[color]}`;

  return (
    <button 
      type={type} 
      onClick={onClick} 
      className={buttonClass} 
      disabled={disabled}
    >
      {children}
    </button>
  );
};