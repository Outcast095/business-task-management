// src/server/middleware/verified.middleware.ts

import { Request, Response, NextFunction } from 'express';
import type { RequestUser } from '../../shared/types/auth.js';

export const requireVerifiedEmail = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user as RequestUser | undefined;

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Не авторизован'
    });
  }

  if (!user.is_verified) {
    return res.status(403).json({
      success: false,
      message: 'Пожалуйста, подтвердите ваш email адрес перед выполнением этого действия'
    });
  }

  if (!user.is_active) {
    return res.status(403).json({
      success: false,
      message: 'Ваш аккаунт заблокирован'
    });
  }

  next();
};