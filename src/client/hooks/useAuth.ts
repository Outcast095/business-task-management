// ФАЙЛ useAuth.ts
// src/client/hooks/useAuth.ts

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../api/auth.api';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  


  /**
   * Универсальный метод для входа и регистрации
   * @param type - 'login' или 'register'
   * @param payload - данные из формы (email, password, name)
   */
  const handleAuth = async (type: 'login' | 'register', payload: any) => {
    setLoading(true);
    setError(null);

    
    try {
      // 1. Вызываем соответствующий метод API
      const response = type === 'register' 
        ? await AuthService.register(payload) 
        : await AuthService.login(payload);

      // 2. Извлекаем данные из ответа сервера
      // Предполагаем, что сервер возвращает { data: { token: '...', user: { id: 1, name: '...' } } }
      const { token, user } = response.data;

      if (!token || !user?.id) {
        throw new Error('Данные пользователя не получены от сервера');
      }

      // 3. Сохраняем данные в браузерное хранилище
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // 4. СТРАТЕГИЧЕСКИЙ ШАГ: 
      // Направляем пользователя на его уникальный роут, используя ID из базы данных
      navigate(`/todos/${user.id}`); 

    } catch (err: any) {
      // Обработка ошибок (например, 409 Conflict или 401 Unauthorized)
      setError(err.message || 'Произошла ошибка при авторизации');
      console.error('Auth Error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Метод для выхода из системы
   */
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // При выходе возвращаем на страницу авторизации
    navigate('/auth');
  };

  return { 
    handleAuth, 
    logout, 
    loading, 
    error 
  };
};