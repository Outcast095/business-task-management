import React from 'react';
import styles from './EmptyState.module.scss';

export const EmptyState: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>📝</div>
      <h3 className={styles.title}>Список задач пуст</h3>
      <p className={styles.subtitle}>Самое время запланировать что-то грандиозное!</p>
    </div>
  );
};