// файл /NotFoundPage.tsx
// файл расположен по адресу src/client/pages/NotFoundPage.tsx


import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/button/Button';
import styles from './NotFoundPage.module.scss';

export const NotFoundPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.code}>404</h1>
      <h2 className={styles.title}>Упс! Страница не найдена</h2>
      <p className={styles.description}>
        Похоже, вы забрели в неизведанные цифровые пустоши...
      </p>
      
      <Link to="/" style={{ textDecoration: 'none' }}>
        <Button color="blue">Вернуться на главную</Button>
      </Link>
    </div>
  );
};