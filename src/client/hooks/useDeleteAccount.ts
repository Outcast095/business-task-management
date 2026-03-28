
// это файл useDeleteAccount.ts
// расположен по адресу src/client/hooks/useDeleteAccount.ts
import { useState } from 'react';

export const useDeleteAccount = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteAccount = async (password: string, userId: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (!response.ok) {
        // Если пароль неверный или другая ошибка сервера
        throw new Error(data.error || 'Не удалось удалить профиль');
      }

      // Если удаление прошло успешно
      localStorage.clear();
      window.location.href = '/auth';
      return true;

    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteAccount, loading, error, setError };
};