// src/server/index.ts
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import taskRoutes from './routes/taskRoutes.js'; 
import authRoutes from './routes/auth.routes.js';
import initDB from './database/init.sql.js'; 
import editRoutes from '../server/routes/editRoutes.js';

// Настройка путей для ESM модулей
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Загружаем переменные окружения (.env)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Middleware
app.use(cors());
app.use(express.json());

// 2. Раздача статических файлов фронтенда из папки dist
// (Папка dist находится на два уровня выше относительно этого файла: src -> server -> index.ts)
app.use(express.static(path.resolve(__dirname, '../../dist')));

// 3. API Роуты
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', editRoutes);

// 4. ГЛАВНОЕ: Поддержка React Router (SPA)
// Если запрос не к API и не к статическому файлу, отдаем index.html
app.get(/.*/, (req: Request, res: Response, next: NextFunction) => {
  // Пропускаем запросы, которые начинаются с /api, чтобы они попали в 404 ниже
  if (req.url.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.resolve(__dirname, '../../dist/index.html'));
});

// 5. 404 handler (теперь только для несуществующих API эндпоинтов)
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "API Route not found" });
});

// 6. Глобальный обработчик ошибок
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error(`[Error ${statusCode}]:`, message);

  res.status(statusCode).json({ 
    success: false,
    error: message 
  });
});

/**
 * Инициализируем БД и только ПОСЛЕ этого запускаем сервер
 */
const startServer = async () => {
  try {
    // Ждем создания таблиц
    await initDB(); 
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1); 
  }
};

startServer();