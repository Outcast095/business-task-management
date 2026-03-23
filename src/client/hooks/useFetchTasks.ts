// ФАЙЛ useFetchTasks.ts

import { useState, useEffect, useCallback } from 'react';
import { TaskService } from '@/client/api/task.api';
import { ITask } from '@/shared/types'; // Не забывай про типы

export const useFetchTasks = (userId: string | undefined, page: number) => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  
  // Оборачиваем в useCallback, чтобы избежать лишних рендеров
  const load = useCallback(async () => {
    if (!userId) return; // Ждем, пока появится ID пользователя

    try {
      setLoading(true);
      // ПЕРЕДАЕМ ДВА АРГУМЕНТА: userId и page
      const data = await TaskService.fetch(userId, page);
      
      setTasks(data.tasks || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Ошибка при загрузке задач:", err);
    } finally {
      setLoading(false);
    }
  }, [userId, page]); // Зависит от юзера и страницы

  useEffect(() => {
    load();
  }, [load]); // Вызываем при изменении load (которое зависит от userId и page)

  return { tasks, totalPages, loading, refresh: load };
};