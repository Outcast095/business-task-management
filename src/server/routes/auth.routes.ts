// файл auth.routes.ts
// расположен по адресу src/server/routes/auth.routes.ts

// src/server/routes/auth.routes.ts
import { Router } from 'express';
import { 
  signUp, 
  signIn, 
  verifyEmail, 
  resendVerification,
  refresh,
  logout 
} from '../controllers/auth.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import pool from '../database/db.js';

const router = Router();

// Публичные роуты
router.post('/register', signUp);
router.post('/login', signIn);
router.post('/refresh', refresh); // Для обновления access-токена через куки
router.post('/logout', logout);   // Для очистки кук и БД

// Роуты верификации email
router.get('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);

// Защищённый роут — информация о текущем пользователе
router.get('/me/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const loggedInUserId = (req as any).user.userId;

    if (Number(userId) !== loggedInUserId) {
      return res.status(403).json({ error: "У вас нет прав для доступа к этим данным" });
    }
    
    const userQuery = await pool.query(
      'SELECT id, name, email, avatar_url, is_verified, role, is_active FROM users WHERE id = $1',
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