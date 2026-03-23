// src/client/hooks/useEdit.ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useEdit = (userId: string | undefined) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const updateUserInfo = async (formData: { name: string; email?: string; password?: string; avatar_url?: string }) => {
    
    if (!userId) return;

    setLoading(true);
    setStatus('idle');

    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Ошибка при обновлении');

      const updatedData = await response.json();
      
      // Обновляем данные в localStorage, чтобы Header тоже увидел новое имя
      const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...savedUser, ...updatedData }));

      setStatus('success');
      setTimeout(() => navigate('/profile'), 1500); // Возвращаемся в профиль через 1.5 сек
    } catch (err) {
      setStatus('error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { updateUserInfo, loading, status };
};