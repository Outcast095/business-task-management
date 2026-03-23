// файл /Form.tsx 
// файл расположен по адресу src/client/components/form/Form.tsx

import React, { useState } from 'react';
import { Button } from '../button/Button';
import styles from './Form.module.scss'; 

interface FormProps {
  onAdd: (title: string) => void;
}

export const Form: React.FC<FormProps> = ({ onAdd }) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onAdd(value);
    setValue('');
  };

  const handleClear = () => {
    setValue('');
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.inputWrapper}>
        <input 
          type="text" 
          className={styles.input}
          value={value} 
          onChange={(e) => setValue(e.target.value)} 
          placeholder="Что на очереди?"
        />
        
        {/* Показываем крестик только если есть текст */}
        {value && (
          <button 
            type="button" 
            className={styles.clearButton} 
            onClick={handleClear}
            aria-label="Очистить поле"
          >
            &times;
          </button>
        )}
      </div>

      <Button 
        type="submit" 
        color="blue" 
        disabled={!value.trim()}
      >
        Добавить
      </Button>
    </form>
  );
};