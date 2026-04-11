// ФАЙЛ useAuth.ts
// src/client/hooks/useAuth.ts

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../api/auth.api';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAuth = async (type: 'login' | 'register', payload: any) => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = type === 'register' 
        ? await AuthService.register(payload) 
        : await AuthService.login(payload);

      if (type === 'register') {
        // После регистрации просто выводим сообщение, не логиним сразу
        setMessage(response.message || 'Регистрация успешна! Проверьте почту для подтверждения.');
      } else {
        // При логине сохраняем токены и переходим в приложение
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        navigate(`/todos/${user.id}`);
      }
    } catch (err: any) {
      // Axios хранит ответ сервера в err.response
      const apiError = err.response?.data?.error || err.response?.data?.message || 'Ошибка авторизации';
      setError(apiError);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
    } catch (err) {
      console.error('Ошибка при выходе:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/auth');
    }
  };

  return { 
    handleAuth, 
    logout, 
    loading, 
    error,
    message 
  };
};