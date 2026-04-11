/// это файл VerifyEmailPage.tsx, 
// он находится по адресу src/client/pages/verifyEmail/VerifyEmailPage.tsx
 

import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { AuthService } from '../../api/auth.api'; // Импортируем наш сервис
import styles from './VerifyEmailPage.module.scss';

export const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Токен подтверждения отсутствует в ссылке');
      return;
    }

    // Используем AuthService вместо "голого" fetch
    AuthService.verifyEmail(token)
      .then((data) => {
        setStatus('success');
        setMessage(data.message || 'Email успешно подтверждён!');
        
        // Автопереход на страницу авторизации через 2.5 секунды
        const timer = setTimeout(() => navigate('/auth'), 2500);
        return () => clearTimeout(timer); // Очистка таймера
      })
      .catch((err) => {
        setStatus('error');
        // Берем ошибку из ответа сервера (Axios) или дефолтную
        const errorMsg = err.response?.data?.message || 'Ссылка недействительна или просрочена';
        setMessage(errorMsg);
      });
  }, [searchParams, navigate]);

  return (
    <div className={styles.verifyContainer}>
      <div className={styles.verifyCard}>
        <h1 className={styles.title}>Подтверждение email</h1>

        {status === 'loading' && (
          <p className={styles.message}>Проверяем вашу ссылку...</p>
        )}

        {status === 'success' && (
          <div className={styles.success}>
            <p>{message}</p>
            <p className={styles.small}>Сейчас вы будете перенаправлены на страницу входа...</p>
          </div>
        )}

        {status === 'error' && (
          <div className={styles.error}>
            <p>{message}</p>
            <Link to="/auth" className={styles.link}>
              Перейти к входу
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};