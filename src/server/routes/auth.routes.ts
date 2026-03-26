// файл auth.routes.ts
// расположен по адресу src/server/routes/auth.routes.ts

import { Router } from 'express';
import { signUp, signIn } from '../controllers/auth.controller.js';
import pool from '../database/db.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/register', signUp);
router.post('/login', signIn); 

// ИСПРАВЛЕННЫЙ РОУТ С ЗАЩИТОЙ:
router.get('/me/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const loggedInUserId = (req as any).user.userId;

    // Проверяем, что юзер запрашивает свои данные
    if (Number(userId) !== loggedInUserId) {
      return res.status(403).json({ error: "У вас нет прав для доступа к этим данным" });
    }
    
    // Добавили avatar_url в SELECT
    const userQuery = await pool.query(
      'SELECT id, name, email, avatar_url FROM users WHERE id = $1',
      [userId]
    );

    if (userQuery.rows.length === 0) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    res.json(userQuery.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;