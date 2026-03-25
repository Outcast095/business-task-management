// это файл useEdit.ts
// расположен по адресу src/client/hooks/useEdit.ts

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface formDataType {
  name: string; 
  email?: string; 
  password?: string; 
  avatar_url?: string; // Старый URL (на случай, если файл не меняли)
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
      // 1. Создаем объект FormData вместо обычного объекта
      const data = new FormData();
      
      // 2. Наполняем его текстовыми данными
      data.append('name', formData.name);
      if (formData.email) data.append('email', formData.email);
      if (formData.password) data.append('password', formData.password);
      
      // 3. Добавляем файл, если он был выбран в DragDrop
      if (file) {
        // Ключ 'avatar' должен совпадать с тем, что мы пропишем в Multer на бэкенде
        data.append('avatar', file); 
      } else if (formData.avatar_url) {
        // Если нового файла нет, отправляем старую ссылку, чтобы не затереть её в БД
        data.append('avatar_url', formData.avatar_url);
      }

      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'PUT',
        // ВНИМАНИЕ: Мы убрали заголовок 'Content-Type'. 
        // Браузер сам добавит multipart/form-data и сгенерирует Boundary.
        body: data, 
      });

      if (!response.ok) throw new Error('Ошибка при обновлении');

      const updatedData = await response.json();
      
      // Обновляем данные в localStorage
      const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...savedUser, ...updatedData }));

      setStatus('success');
      setTimeout(() => navigate('/profile'), 1500);
    } catch (err) {
      setStatus('error');
      console.error('Update error:', err);
    } finally {
      setLoading(false);
    }
  };

  return { updateUserInfo, loading, status };
};