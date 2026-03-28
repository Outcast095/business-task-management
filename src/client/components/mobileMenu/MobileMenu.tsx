// файл /MobileMenu.tsx
// файл расположен по адресу src/client/components/mobileMenu/MobileMenu.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import styles from './MobileMenu.module.scss';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  logout: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, user, logout }) => {
  return (
    <div className={`${styles.overlay} ${isOpen ? styles.active : ''}`} onClick={onClose}>
      <div className={styles.menuContent} onClick={(e) => e.stopPropagation()}>
        <nav className={styles.nav}>
          <Link to={user ? `/todos/${user.id}` : '/auth'} onClick={onClose}>Задачи</Link>
          <Link to="/profile" onClick={onClose}>Профиль</Link>
          <Link to="/about" onClick={onClose}>О проекте</Link>
        </nav>
        
        <div className={styles.divider}></div>
        
        <div className={styles.userSection}>
          <span className={styles.userName}>{user?.name || 'Гость'}</span>
          <button onClick={logout} className={styles.logoutBtn}>Выйти</button>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;