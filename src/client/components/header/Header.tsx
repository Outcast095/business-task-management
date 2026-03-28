// компонент Header.tsx
// расположен по адресу src/client/components/header/Header.tsx
// src/client/components/header/Header.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useProfile } from '../../hooks/useProfile';
import MobileMenu from '../mobileMenu/MobileMenu'; // Импортируем новый компонент
import styles from './Header.module.scss';

export const Header: React.FC = () => {
  const location = useLocation();
  const { user, loading, logout } = useProfile();
  
  // Состояние открытия мобильного меню
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Закрываем меню при смене маршрута (страницы)
  useEffect(() => {
    setIsMenuOpen(false);
    document.body.style.overflow = 'unset';
  }, [location.pathname]);

  // Функция переключения меню с блокировкой скролла
  const toggleMenu = () => {
    const newState = !isMenuOpen;
    setIsMenuOpen(newState);
    document.body.style.overflow = newState ? 'hidden' : 'unset';
  };

  if (loading && !user) {
    return (
      <header className={styles.header}>
        <div className={styles.container}></div>
      </header>
    );
  }

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : '?';

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* ЛОГОТИП */}
        <Link to="/" className={styles.logo}>
          <span className={styles.logoDot}></span>
          TODO<span>PRO</span>
        </Link>

        {/* ДЕКСТОПНАЯ НАВИГАЦИЯ (скроем в SCSS на мобилках) */}
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

        {/* ДЕКСТОПНАЯ СЕКЦИЯ ПОЛЬЗОВАТЕЛЯ (тоже скроем в SCSS) */}
        <div className={styles.userSection}>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user?.name || 'Гость'}</span>
            <div className={styles.avatar}>
              {user?.avatar_url ? (
                <img 
                  src={user.avatar_url} 
                  alt={user.name} 
                  className={styles.avatarImg}
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

        {/* КНОПКА БУРГЕРА (появится только на мобилках) */}
        <button 
          className={`${styles.burger} ${isMenuOpen ? styles.burgerActive : ''}`} 
          onClick={toggleMenu}
          aria-label="Меню"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* МОБИЛЬНОЕ МЕНЮ (отдельный компонент) */}
      <MobileMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        user={user} 
        logout={logout} 
      />
    </header>
  );
};