// файл useProfile.ts
// расположен src/client/hooks/useProfile.ts

// src/client/hooks/useProfile.ts

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export interface UserData {
  id: number;
  name: string;
  email: string;
  avatar_url?: string; // Поле теперь официально существует в типе!
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
        const savedUserRaw = localStorage.getItem('user');
        if (!savedUserRaw) {
          navigate('/auth');
          return;
        }

        const savedUser = JSON.parse(savedUserRaw);
        const userId = savedUser.id;
        const token = localStorage.getItem('token'); // Получаем токен

        if (!userId || !token) {
          navigate('/auth');
          return;
        }

        const headers = {
          'Authorization': `Bearer ${token}`
        };

        // Запрашиваем данные пользователя и статистику параллельно
        const [userRes, statsRes] = await Promise.all([
          fetch(`http://localhost:5000/api/auth/me/${userId}`, { headers }),
          fetch(`http://localhost:5000/api/tasks/stats/${userId}`, { headers })
        ]);

        if (!userRes.ok || !statsRes.ok) {
          throw new Error('Ошибка при загрузке данных профиля');
        }

        const userData: UserData = await userRes.json();
        const statsData: UserStats = await statsRes.json();

        // Устанавливаем данные в стейт
        setUser(userData);
        setStats(statsData);

        // Обновляем localStorage свежими данными (включая новый avatar_url)
        localStorage.setItem('user', JSON.stringify(userData));

      } catch (err: any) {
        setError(err.message);
        console.error("Profile fetch error:", err);
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