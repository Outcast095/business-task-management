//файл /Task.tsx
//файл расположен по адресу src/client/components/task/Task.tsx


import React from 'react';
import { Checkbox } from '../checkbox/Checkbox';
import { Button } from '../button/Button';
import styles from './Task.module.scss';

interface TaskProps {
  title: string;
  completed: boolean;
  onToggle: () => void;
  onDelete: () => void;
}

export const Task: React.FC<TaskProps> = ({ title, completed, onToggle, onDelete }) => {
  
  // Обработчик для кнопки удаления, чтобы клик не "проваливался" в родительский div
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <div className={styles.taskCard}>
      <div 
        className={`${styles.content} ${completed ? styles.completed : ''}`} 
        onClick={onToggle}
      >
        <Checkbox checked={completed} onChange={onToggle} />
        
        {/* Атрибут title покажет полный текст при наведении на обрезаную строку */}
        <span title={title}>
          {title}
        </span>
      </div>

      {/* Передаем наш обработчик с остановкой всплытия */}
      <Button onClick={handleDelete} color="red">
        Удалить
      </Button>
    </div>
  );
};