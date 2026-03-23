// компонент Header.tsx
// расположен по адресу src/client/components/header/Header.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useProfile } from '../../hooks/useProfile'; // Импортируем наш хук
import styles from './Header.module.scss';


export const Header: React.FC = () => {
  const location = useLocation();
  
  // Берем данные из хука, а не из localStorage напрямую!
  const { user, loading, logout } = useProfile();

  // Пока данные грузятся, можем показать скелетон или просто пустое место
  if (loading && !user) return <header className={styles.header}><div className={styles.container}></div></header>;

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : '?';

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoDot}></span>
          TODO<span>PRO</span>
        </Link>

        <nav className={styles.nav}>
          <Link 
            to={user ? `/todos/${user.id}` : '/auth'} 
            className={location.pathname.includes('/todos') ? styles.active : ''}
          >
            Задачи
          </Link>
          <Link to="/profile" className={location.pathname === '/profile' ? styles.active : ''}>
            Профиль
          </Link>
          <Link to="/about" className={location.pathname === '/about' ? styles.active : ''}>
            О проекте
          </Link>
        </nav>

        <div className={styles.userSection}>
          <div className={styles.userInfo}>
            {/* Теперь здесь всегда актуальное имя из БД */}
            <span className={styles.userName}>{user?.name || 'Гость'}</span>
            <div className={styles.avatar}>{userInitial}</div>
          </div>
          <div className={styles.divider}></div>
          <button onClick={logout} className={styles.logoutBtn}>
            Выйти
          </button>
        </div>
      </div>
    </header>
  );
};