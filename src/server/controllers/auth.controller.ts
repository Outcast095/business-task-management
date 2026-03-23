// этой файл 'auth.controller.ts
// расположен по адресу src/server/controllers/auth.controller.ts
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../database/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  try {
    // Проверка на существующего юзера
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (userExists.rows.length > 0) {
      const error = new Error('Пользователь с таким email уже существует');
      (error as any).statusCode = 409;
      throw error;
    }

    // Хеширование
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Сохранение в Postgres (возвращаем id, name, email и avatar_url)
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, avatar_url',
      [name, email, hashedPassword]
    );

    const user = newUser.rows[0];

    // Генерация токена
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
      success: true,
      message: 'Регистрация прошла успешно',
      data: { token, user }
    });
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    // 1. Ищем пользователя по email
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      const error = new Error('Неверный email или пароль');
      (error as any).statusCode = 401; // Unauthorized
      throw error;
    }

    // 2. Проверяем пароль (сравниваем введенный с хешем из БД)
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      const error = new Error('Неверный email или пароль');
      (error as any).statusCode = 401;
      throw error;
    }
    
    // --- НОВОЕ: Проверка, не забанен ли юзер ---
    if (!user.is_active) {
      const error = new Error('Ваш аккаунт заблокирован');
      (error as any).statusCode = 403;
      throw error;
    }

    await pool.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    // 3. Генерируем токен
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });

    // Удаляем хеш пароля из объекта, чтобы не отправлять его на фронт
    delete user.password_hash;

    res.status(200).json({
      success: true,
      message: 'Вход выполнен успешно',
      data: { token, user }
    });
  } catch (error) {
    next(error);
  }
};