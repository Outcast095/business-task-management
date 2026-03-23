// файл auth.routes.ts
// расположен по адресу src/server/routes/auth.routes.ts

import { Router } from 'express';
import { signUp,  signIn} from '../controllers/auth.controller.js';
import pool from '../database/db.js';

const router = Router();


router.post('/register', signUp);
router.post('/login', signIn); 

// ДОБАВЛЯЕМ ЭТОТ РОУТ:
router.get('/me/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const userQuery = await pool.query(
      'SELECT id, name, email FROM users WHERE id = $1',
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