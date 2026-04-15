// src/server/routes/taskRoutes.ts

import { Router, Request, Response, NextFunction } from 'express';
import pool from '../database/db.js';
import { ITask } from '@/shared/types.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { requireVerifiedEmail } from '../middleware/verified.middleware.js';
import type { RequestUser } from '../../shared/types/auth.js';

const router = Router();

// Глобальные middleware
router.use(authenticateToken);
router.use(requireVerifiedEmail);

// Типизированный middleware проверки владельца
const checkOwnership = (req: Request, res: Response, next: NextFunction): void => {
  const user = (req as any).user as RequestUser;
  const userIdFromParams = req.params.userId;

  if (userIdFromParams && Number(userIdFromParams) !== user.userId) {
    res.status(403).json({ error: 'У вас нет прав для доступа к этим данным.' });
    return;
  }
  next();
};

// ====================== GET STATS ======================
router.get('/stats/:userId', checkOwnership, async (req: Request<{ userId: string }>, res: Response) => {
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

// ====================== GET TASKS ======================
router.get('/:userId', checkOwnership, async (req: Request<{ userId: string }>, res: Response) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = 6;
    const offset = (page - 1) * limit;

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

// ====================== CREATE TASK ======================
router.post('/:userId', checkOwnership, async (req: Request<{ userId: string }, {}, { title: string }>, res: Response) => {
  try {
    const { userId } = req.params;
    const { title } = req.body;

    if (!title?.trim()) {
      res.status(400).json({ error: "Название пустое" });
      return;
    }

    const newTask = await pool.query<ITask>(
      'INSERT INTO tasks (title, user_id) VALUES ($1, $2) RETURNING *',
      [title, userId]
    );
    res.json(newTask.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ====================== TOGGLE TASK ======================
router.patch('/:id', async (req: Request<{ id: string }, {}, { completed: boolean }>, res: Response) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;
    const loggedInUserId = (req as any).user.userId;

    const updatedTask = await pool.query<ITask>(
      'UPDATE tasks SET completed = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      [completed, id, loggedInUserId]
    );

    if (updatedTask.rows.length === 0) {
      res.status(404).json({ error: "Задача не найдена или у вас нет прав." });
      return;
    }

    res.json(updatedTask.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ====================== DELETE TASK ======================
router.delete('/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const loggedInUserId = (req as any).user.userId;

    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2', 
      [id, loggedInUserId]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ error: "Задача не найдена или у вас нет прав." });
      return;
    }

    res.json({ message: "Задача успешно удалена" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;