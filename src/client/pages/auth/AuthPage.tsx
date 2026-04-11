// это файл 'AuthPage.tsx
// расположен по адресу src/client/pages/auth/AuthPage.tsx

import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/button/Button'; 
import styles from './AuthPage.module.scss';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  
  const { handleAuth, loading, error, message } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const type = isLogin ? 'login' : 'register';
    await handleAuth(type, formData);
  };

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authCard}>
        {/* 1. Если регистрация успешна и есть сообщение — показываем экран уведомления */}
        {message ? (
          <div className={styles.successContainer}>
            <div className={styles.icon} style={{ fontSize: '3rem', marginBottom: '1rem' }}>📧</div>
            <h2 className={styles.title}>Подтвердите Email</h2>
            <p className={styles.description} style={{ marginBottom: '1.5rem', color: '#666' }}>
              {message}
            </p>
            <Button onClick={() => window.location.reload()} color="blue">
              Вернуться ко входу
            </Button>
          </div>
        ) : (
          /* 2. Если сообщения нет — показываем обычную форму (Логин или Регистрация) */
          <>
            <h2 className={styles.title}>{isLogin ? 'Вход' : 'Регистрация'}</h2>
            
            <div className={styles.tabs} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
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
                  className={styles.input}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '10px' }}
                />
              )}
              <input 
                type="email" 
                placeholder="Email" 
                required 
                className={styles.input}
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '10px' }}
              />
              <input 
                type="password" 
                placeholder="Пароль" 
                required 
                className={styles.input}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                style={{ display: 'block', width: '100%', marginBottom: '20px', padding: '10px' }}
              />
              
              {error && <p className={styles.errorText} style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
              
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
          </>
        )}
      </div>
    </div>
  );
};