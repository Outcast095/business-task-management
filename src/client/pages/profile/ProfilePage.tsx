//файл /ProfilePage.tsx
//файл расположен по адресу src/client/pages/profile/ProfilePage.tsx

import React from 'react';
import { useProfile } from '../../hooks/useProfile';
import { Button } from '../../components/button/Button';
import styles from './ProfilePage.module.scss';
import { useNavigate } from 'react-router-dom';



export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, stats, loading, logout } = useProfile();

  if (loading) return (
    <div className={styles.container}>
      <div className={styles.loader}>Загрузка профиля...</div>
    </div>
  );


  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.errorCard}>
          <div className={styles.errorIcon}>⚠️</div>
          <h2>Упс! Данные не получены</h2>
          <p>
            Не удалось загрузить профиль. Возможно, сервер временно недоступен 
            или ваша сессия истекла.
          </p>
          <div className={styles.errorActions}>
            <Button onClick={() => window.location.reload()}>Повторить попытку</Button>
            <Button color="red" onClick={logout}>Вернуться на вход</Button>
          </div>
        </div>
      </div>
    );
  }

  const userInitial = user?.name.charAt(0).toUpperCase();

  return (
    <div className={styles.container}>
      <div className={styles.avatar}>{userInitial}</div>
      
      <div className={styles.info}>
        <h1>{user?.name}</h1>
        <p>{user?.email}</p>
      </div>
      
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <label>Всего задач</label>
          <span>{stats.total}</span>
        </div>
        <div className={styles.statCard}>
          <label>Выполнено</label>
          <span className={styles.completedCount}>{stats.completed}</span>
        </div>
      </div>

      <Button onClick={() => navigate(`/edit/${user.id}`)}>
          Редактировать данные
      </Button>
    </div>
  );
};