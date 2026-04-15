// src/server/middleware/auth.middleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../database/db.js';
import type { RequestUser } from '../../shared/types/auth.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Доступ запрещен. Токен отсутствует.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };

    // Запрашиваем полный профиль пользователя из БД
    const userResult = await pool.query(
      `SELECT 
         id, 
         name, 
         email, 
         avatar_url, 
         role, 
         is_active, 
         is_verified 
       FROM users 
       WHERE id = $1`,
      [decoded.userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(403).json({
        success: false,
        error: 'Пользователь не найден.'
      });
    }

    const user = userResult.rows[0];

    // Приводим к нашему типу
    (req as any).user = {
      ...user,
      userId: user.id
    } as RequestUser;

    next();
  } catch (err: any) {
    return res.status(403).json({
      success: false,
      error: 'Неверный или просроченный токен.'
    });
  }
};