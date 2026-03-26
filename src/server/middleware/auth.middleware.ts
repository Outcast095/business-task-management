// это файл auth.middleware.ts
// он расположен по адресу src/server/middleware/auth.middleware.ts 

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Извлекаем токен из "Bearer <TOKEN>"

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      error: 'Доступ запрещен. Токен отсутствует.' 
    });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        error: 'Неверный или просроченный токен.' 
      });
    }

    // Сохраняем расшифрованные данные пользователя (обычно { userId: ... }) в объект запроса
    (req as any).user = user;
    next(); 
  });
};
