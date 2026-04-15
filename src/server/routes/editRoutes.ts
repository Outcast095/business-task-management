// src/server/routes/editRoutes.ts

import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import { updateProfile, deleteProfile } from '../controllers/edit.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { requireVerifiedEmail } from '../middleware/verified.middleware.js';
import type { RequestUser } from '../../shared/types/auth.js';

const router = Router();

// Глобальные middleware для всех роутов редактирования
router.use(authenticateToken);
router.use(requireVerifiedEmail);

// Типизированный middleware проверки владельца
const checkOwnership = (req: Request, res: Response, next: NextFunction): void => {
  const user = (req as any).user as RequestUser;
  const userIdFromParams = req.params.userId;

  if (userIdFromParams && Number(userIdFromParams) !== user.userId) {
    res.status(403).json({ error: 'У вас нет прав для этого действия.' });
    return;
  }
  next();
};

// ====================== MULTER CONFIG ======================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/server/uploads/'); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Можно загружать только изображения!'));
    }
  }
});

// ====================== ROUTES ======================

// PUT /api/users/:userId - обновление профиля (с аватаркой)
router.put(
  '/:userId', 
  checkOwnership, 
  upload.single('avatar'), 
  updateProfile
);

// DELETE /api/users/:userId - удаление профиля
router.delete(
  '/:userId', 
  checkOwnership, 
  deleteProfile
);

export default router;