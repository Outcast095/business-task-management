// файл /Checkbox.tsx
// файл расположен по адресу src/client/components/checkbox/Checkbox.tsx

import React from 'react';
import styles from './Checkbox.module.scss';
import { useTasks } from '@/client/hooks/useTasks';

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange }) => {
  return (
    <label 
      className={styles.checkboxWrapper} 
      onClick={(e) => e.stopPropagation()} 
    >
      <input 
        type="checkbox" 
        className={styles.hiddenInput} 
        checked={checked} 
        onChange={onChange} // Теперь это сработает
      />
      <span className={styles.customCheck} />
    </label>
  );
};