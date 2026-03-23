import React from 'react';
import styles from './Title.module.scss';

interface TitleProps {
  totalTasks: number;
  completedTasks: number;
}

export const Title: React.FC<TitleProps> = ({ totalTasks, completedTasks }) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.mainTitle}>Fullstack Tasks</h1>
      <div className={styles.countBadge}>
        {completedTasks} / {totalTasks} DONE
      </div>
    </div>
  );
};