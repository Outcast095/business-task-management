// файл useProfile.ts
// расположен src/client/hooks/useProfile.ts

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserData {
  id: number | string;
  name: string;
  email: string;
}

interface UserStats {
  total: string;
  completed: string;
}

export const useProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [stats, setStats] = useState<UserStats>({ total: '0', completed: '0' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = savedUser.id;

        if (!userId) {
          navigate('/auth');
          return;
        }

        const [userRes, statsRes] = await Promise.all([
          fetch(`http://localhost:5000/api/auth/me/${userId}`),
          fetch(`http://localhost:5000/api/tasks/stats/${userId}`)
        ]);

        if (!userRes.ok || !statsRes.ok) {
          throw new Error('Ошибка при загрузке данных профиля');
        }

        const userData = await userRes.json();
        const statsData = await statsRes.json();

        setUser(userData);
        setStats(statsData);
      } catch (err: any) {
        setError(err.message);
        console.error("Profile fetch error:", err);
        // Если данные не загрузились (например, юзер удален), разлогиниваем
        // Но можно оставить на усмотрение компонента
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth');
  };

  return { user, stats, loading, error, logout };
};