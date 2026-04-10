// src/server/middleware/verified.middleware.ts
import { Request, Response, NextFunction } from 'express';

export const requireVerifiedEmail = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;

  // Если пользователь не авторизован или email не подтверждён
  if (!user || user.is_verified !== true) {
    return res.status(403).json({
      success: false,
      message: 'Пожалуйста, подтвердите ваш email адрес перед выполнением этого действия'
    });
  }

  next();
};