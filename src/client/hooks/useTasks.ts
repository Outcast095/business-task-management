/// мой файл useTasks.ts
/// src/client/hooks/useTasks.ts


import { useState, useEffect, useCallback } from 'react';
import { ITask } from '@/shared/types';
import { TaskService } from '../api/task.api';

export const useTasks = (userId?: string) => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ГЛАВНАЯ ФУНКЦИЯ ЗАГРУЗКИ (из Варианта 1)
  const fetchTasks = useCallback(async (targetPage: number) => {
    if (!userId) return;

    try {
      setLoading(true);
      const data = await TaskService.fetch(userId, targetPage);
      setTasks(data.tasks || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Ошибка загрузки задач:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Следим за изменением страницы или пользователя
  useEffect(() => {
    fetchTasks(page);
  }, [page, fetchTasks]);

  // ДОБАВЛЕНИЕ: всегда переходим на 1-ю страницу, чтобы увидеть новую задачу
  const addTask = async (title: string) => {
    if (!userId) return;
    try {
      await TaskService.add(userId, title);
      if (page === 1) {
        fetchTasks(1);
      } else {
        setPage(1); // Это автоматически вызовет useEffect и fetchTasks
      }
    } catch (err) {
      console.error("Ошибка добавления:", err);
    }
  };

  // УДАЛЕНИЕ: делаем рефетч, чтобы "дырка" в списке заполнилась задачей со следующей страницы
  const deleteTask = async (id: number) => {
    try {
      await TaskService.delete(id);
      
      // Если удалили последнюю задачу на текущей странице (и это не 1-я страница)
      if (tasks.length === 1 && page > 1) {
        setPage(prev => prev - 1);
      } else {
        fetchTasks(page);
      }
    } catch (err) {
      console.error("Ошибка удаления:", err);
    }
  };

  // ЧЕКБОКС: используем мгновенное обновление (из Варианта 2)
  const toggleTask = async (id: number, currentStatus: boolean) => {
    try {
      // 1. Мгновенно обновляем стейт на фронте (UX)
      // ВАЖНО: передаем !currentStatus, так как мы инвертируем состояние
      const nextStatus = !currentStatus;
      
      // Оптимистично меняем задачу в списке
      setTasks(prev => prev.map(t => 
        t.id === id ? { ...t, completed: nextStatus } : t
      ));

      // 2. Отправляем запрос на сервер в фоне
      const updatedFromServer = await TaskService.toggle(id, nextStatus);

      // 3. (Опционально) Синхронизируем стейт данными от сервера для точности
      setTasks(prev => prev.map(t => t.id === id ? updatedFromServer : t));
    } catch (err) {
      console.error("Ошибка переключения:", err);
      // Если сервер ответил ошибкой — возвращаем статус назад
      fetchTasks(page); 
    }
  };

  return { 
    tasks, 
    loading, 
    page, 
    totalPages, 
    setPage, 
    addTask, 
    deleteTask, 
    toggleTask 
  };
};