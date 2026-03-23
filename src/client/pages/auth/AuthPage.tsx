// это файл 'AuthPage.tsx
// расположен по адресу src/client/pages/auth/AuthPage.tsx

import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/button/Button'; 
import styles from './AuthPage.module.scss';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  
  const { handleAuth, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const type = isLogin ? 'login' : 'register';
    await handleAuth(type, formData);
  };

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authCard}>
        <h2 className={styles.title}>{isLogin ? 'Вход' : 'Регистрация'}</h2>
        
        <div className={styles.tabs}>
          {/* Заменяем табы на наш компонент Button */}
          <Button 
            type="button"
            color={isLogin ? 'blue' : 'transparent'}
            onClick={() => setIsLogin(true)}
          >
            Логин
          </Button>
          <Button 
            type="button"
            color={!isLogin ? 'blue' : 'transparent'} 
            onClick={() => setIsLogin(false)}
          >
            Регистрация
          </Button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {!isLogin && (
            <input 
              type="text" 
              placeholder="Имя" 
              className={styles.input} // Убедись, что стили инпутов тоже подтянуты
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
            />
          )}
          <input 
            type="email" 
            placeholder="Email" 
            required 
            className={styles.input}
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
          />
          <input 
            type="password" 
            placeholder="Пароль" 
            required 
            className={styles.input}
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})} 
          />
          
          {error && <p className={styles.errorText}>{error}</p>}
          
          {/* Главная кнопка отправки формы */}
          <div className={styles.submitWrapper}>
            <Button 
              type="submit" 
              color="blue" 
              disabled={loading}
            >
              {loading ? 'Секунду...' : isLogin ? 'Войти' : 'Создать аккаунт'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};