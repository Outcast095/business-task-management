// это файл editRoutes.ts
// расположен по адресу src/server/routes/editRoutes.ts

import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { updateProfile } from '../controllers/edit.controller.js';

const router = Router();

// 1. Настраиваем хранилище
const storage = multer.diskStorage({
  // Указываем путь к твоей папке
  destination: (req, file, cb) => {
    // Если ты запускаешь сервер из корня проекта, путь будет таким:
    cb(null, 'src/server/uploads/'); 
  },
  // Указываем, под каким именем сохранять
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// 2. Инициализируем multer
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5МБ
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Можно загружать только изображения!'));
    }
  }
});

/**
 * Важно: upload.single('avatar') перехватывает файл ДО того, 
 * как управление попадет в updateProfile.
 * В контроллере файл будет доступен как req.file
 */
router.put('/:userId', upload.single('avatar'), updateProfile); 

export default router;