// это файл editRoutes.ts
// расположен по адресу src/server/routes/editRoutes.ts

// src/server/routes/editRoutes.ts

import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
// 1. Добавляем импорт deleteProfile
import { updateProfile, deleteProfile } from '../controllers/edit.controller.js'; 
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

// Защищаем все роуты в этом файле токеном
router.use(authenticateToken);

// Middleware для проверки прав (Ownership)
const checkOwnership = (req: Request, res: Response, next: Function) => {
  const { userId } = req.params;
  const loggedInUserId = (req as any).user.userId;

  if (userId && Number(userId) !== loggedInUserId) {
    return res.status(403).json({ error: 'У вас нет прав для этого действия.' });
  }
  next();
};

// --- Настройка Multer (оставляем как есть) ---
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

// --- РОУТЫ ---

// 2. Обновление профиля (PUT)
router.put('/:userId', checkOwnership, upload.single('avatar'), updateProfile); 

// 3. УДАЛЕНИЕ ПРОФИЛЯ (DELETE)
// Добавляем этот роут для нашего нового функционала
router.delete('/:userId', checkOwnership, deleteProfile);

export default router;