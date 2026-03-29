import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/button/Button';
import styles from './LandingPage.module.scss';

export const LandingPage: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <header className={styles.hero}>
        <h1>управляй задачами как профи</h1>
        <p>
          Персональный менеджер задач с серверной пагинацией, 
          высокой производительностью и безопасным хранением данных.
        </p>

        <div className={styles.features}>
          <div className={styles.feature}>⚡ Быстрый отклик</div>
          <div className={styles.feature}>📦 Серверная пагинация</div>
          <div className={styles.feature}>🔒 Надежная база данных</div>
        </div>

        <div className={styles.actions}>
          <Link to="/auth">
            <Button color="blue">Начать работу</Button>
          </Link>
        </div>
      </header>
    </div>
  );
};