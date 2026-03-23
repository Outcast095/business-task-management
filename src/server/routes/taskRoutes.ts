//мой файл taskRoutes.ts
//src/server/routes/taskRoutes.ts

import { Router, Request, Response } from 'express';
import pool from '../database/db.js';
import { ITask } from '@/shared/types.js';

const router = Router();

router.get('/stats/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const statsQuery = await pool.query(
      `SELECT 
        COUNT(*)::int as total, 
        COUNT(*) FILTER (WHERE completed = true)::int as completed 
       FROM tasks WHERE user_id = $1`,
      [userId]
    );
    
    res.json(statsQuery.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 1. Получение задач КОНКРЕТНОГО пользователя
// Маршрут теперь: /api/tasks/:userId
router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = 6;
    const offset = (page - 1) * limit;

    // Фильтруем по user_id
    const tasksQuery = await pool.query<ITask>(
      'SELECT * FROM tasks WHERE user_id = $1 ORDER BY id DESC LIMIT $2 OFFSET $3',
      [userId, limit, offset]
    );

    const countQuery = await pool.query('SELECT COUNT(*) FROM tasks WHERE user_id = $1', [userId]);
    const totalTasks = parseInt(countQuery.rows[0].count);
    const totalPages = Math.ceil(totalTasks / limit);

    res.json({
      tasks: tasksQuery.rows,
      totalPages,
      currentPage: page,
      totalTasks
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Добавление задачи для конкретного пользователя
router.post('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { title } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ error: "Название пустое" });
    }

    // Записываем user_id при создании
    const newTask = await pool.query<ITask>(
      'INSERT INTO tasks (title, user_id) VALUES ($1, $2) RETURNING *',
      [title, userId]
    );
    res.json(newTask.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// 3. Обновление статуса

router.patch('/:id', async (
  req: Request<{ id: string }, {}, { completed: boolean }>,
  res: Response<ITask | { error: string }>
) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    const updatedTask = await pool.query<ITask>(
      'UPDATE tasks SET completed = $1 WHERE id = $2 RETURNING *',
      [completed, id]
    );

    if (updatedTask.rows.length === 0) {
      return res.status(404).json({ error: "Задача не найдена" });
    }

    res.json(updatedTask.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Удаление задачи
router.delete('/:id', async (
  req: Request<{ id: string }>, 
  res: Response<{ message: string } | { error: string }>
) => {
  try {
    const { id } = req.params;

    // Выполняем удаление в БД
    const result = await pool.query('DELETE FROM tasks WHERE id = $1', [id]);

    // Проверяем, было ли что-то удалено (rowCount)
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Задача не найдена" });
    }

    res.json({ message: "Задача успешно удалена" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;