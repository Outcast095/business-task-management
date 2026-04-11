// это файл index.ts
// расположен по адресу src/server/index.ts

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser'; // 1. Импортируем для работы с куками
import { fileURLToPath } from 'url';
import taskRoutes from './routes/taskRoutes.js'; 
import authRoutes from './routes/auth.routes.js';
import initDB from './database/init.sql.js'; 
import editRoutes from '../server/routes/editRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 2. Настройка CORS
// КРИТИЧНО: При использовании credentials: true нельзя использовать origin: '*'
app.use(cors({
  origin: 'http://localhost:3000', // Адрес твоего фронтенда
  credentials: true,               // Разрешаем передачу кук (refreshToken)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 3. Остальные Middleware
app.use(express.json());
app.use(cookieParser()); // Подключаем, чтобы сервер видел куки

// Раздача статики
app.use(express.static(path.resolve(__dirname, '../../dist')));
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));

// 4. API Роуты
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', editRoutes);

// 5. Поддержка React Router (SPA)
app.get(/.*/, (req: Request, res: Response, next: NextFunction) => {
  if (req.url.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.resolve(__dirname, '../../dist/index.html'));
});

// 404 handler
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

const startServer = async () => {
  try {
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