// это файл useEdit.ts
// расположен по адресу src/client/hooks/useEdit.ts

// src/client/hooks/useEdit.ts

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface formDataType {
  name: string; 
  email?: string; 
  password?: string; 
  avatar_url?: string; // Текущий URL аватара из базы
}

export const useEdit = (userId: string | undefined) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const updateUserInfo = async (formData: formDataType, file?: File) => {
    if (!userId) return;

    setLoading(true);
    setStatus('idle');

    try {
      const token = localStorage.getItem('token');

      // 1. Создаем объект FormData для отправки файлов и текста
      const data = new FormData();
      
      // 2. Наполняем его данными из формы
      data.append('name', formData.name);
      if (formData.email) data.append('email', formData.email);
      
      // Пароль добавляем только если он не пустой
      if (formData.password && formData.password.trim() !== '') {
        data.append('password', formData.password);
      }
      
      // 3. Логика файла: если выбрали новый — шлем его, если нет — шлем старую ссылку
      if (file) {
        data.append('avatar', file); 
      } else if (formData.avatar_url) {
        data.append('avatar_url', formData.avatar_url);
      }

      // 4. Отправляем запрос с токеном авторизации
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          // ВАЖНО: 'Content-Type' НЕ УКАЗЫВАЕМ, браузер сам поставит multipart/form-data
          'Authorization': `Bearer ${token}`
        },
        body: data, 
      });

      // 5. Проверка безопасности: если токен просрочен (401/403)
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/auth';
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка при обновлении профиля');
      }

      const updatedUserFromServer = await response.json();
      
      // 6. Синхронизируем локальные данные пользователя
      const currentLocalUser = JSON.parse(localStorage.getItem('user') || '{}');
      const newUserData = { ...currentLocalUser, ...updatedUserFromServer };
      localStorage.setItem('user', JSON.stringify(newUserData));

      setStatus('success');
      
      // Небольшая задержка перед редиректом, чтобы юзер увидел успех
      setTimeout(() => {
        navigate('/profile');
      }, 1500);

    } catch (err) {
      setStatus('error');
      console.error('Update profile error:', err);
    } finally {
      setLoading(false);
    }
  };

  return { updateUserInfo, loading, status };
};