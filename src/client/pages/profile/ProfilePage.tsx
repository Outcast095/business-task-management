//файл /ProfilePage.tsx
//файл расположен по адресу src/client/pages/profile/ProfilePage.tsx

import React from 'react';
import { useProfile } from '../../hooks/useProfile';
import { Button } from '../../components/button/Button';
import styles from './ProfilePage.module.scss';
import { useNavigate } from 'react-router-dom';
import { log } from 'console';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, stats, loading, logout } = useProfile();

  console.log('ProfilePage: user', user);

  /*
  'ProfilePage: user', user: {id: 2, name: 'Magomed', email: 'magomed@gmail.com'}
  */
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

  // Определяем букву для фоллбэка
  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : '?';

  return (
    <div className={styles.container}>
      {/* СЕКЦИЯ АВАТАРА */}
      <div className={styles.avatar}>
        {user.avatar_url ? (
          <img 
            src={user.avatar_url} 
            alt={user.name} 
            className={styles.profileImg}
            // Если картинка не прогрузится (ошибка 404), покажем букву
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).parentElement!.innerText = userInitial;
            }}
          />
        ) : (
          userInitial
        )}
      </div>
      
      <div className={styles.info}>
        <h1>{user.name}</h1>
        <p>{user.email}</p>
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