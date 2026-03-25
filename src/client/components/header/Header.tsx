// компонент Header.tsx
// расположен по адресу src/client/components/header/Header.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useProfile } from '../../hooks/useProfile';
import styles from './Header.module.scss';

export const Header: React.FC = () => {
  const location = useLocation();
  
  // Получаем актуальные данные пользователя из хука
  const { user, loading, logout } = useProfile();

  // Пока данные загружаются, отображаем пустой контейнер или скелетон
  if (loading && !user) {
    return (
      <header className={styles.header}>
        <div className={styles.container}></div>
      </header>
    );
  }

  // Первая буква имени для фоллбэка (если нет фото)
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
          <Link 
            to="/profile" 
            className={location.pathname === '/profile' ? styles.active : ''}
          >
            Профиль
          </Link>
          <Link 
            to="/about" 
            className={location.pathname === '/about' ? styles.active : ''}
          >
            О проекте
          </Link>
        </nav>

        <div className={styles.userSection}>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user?.name || 'Гость'}</span>
            
            {/* Блок аватара: приоритет отдаем загруженному изображению */}
            <div className={styles.avatar}>
              {user?.avatar_url ? (
                <img 
                  src={user.avatar_url} 
                  alt={user.name} 
                  className={styles.avatarImg}
                  // Добавляем обработку ошибки, если картинка не загрузится
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).parentElement!.innerText = userInitial;
                  }}
                />
              ) : (
                userInitial
              )}
            </div>
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