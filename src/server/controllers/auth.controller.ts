// этой файл 'auth.controller.ts
// расположен по адресу src/server/controllers/auth.controller.ts
// src/server/controllers/auth.controller.ts
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import pool from '../database/db.js';
import { sendVerificationEmail } from '../utils/email.service.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  console.log('[SIGNUP] Запрос на регистрацию получен для email:', email);

  try {
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (userExists.rows.length > 0) {
      console.log('[SIGNUP] Пользователь уже существует');
      const error = new Error('Пользователь с таким email уже существует');
      (error as any).statusCode = 409;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    console.log('[SIGNUP] Создаём пользователя и токен:', verificationToken.substring(0, 15) + '...');

    const newUser = await pool.query(
      `INSERT INTO users 
       (name, email, password_hash, is_verified, verification_token, verification_token_expires) 
       VALUES ($1, $2, $3, false, $4, $5) 
       RETURNING id, name, email, avatar_url, is_verified`,
      [name, email, hashedPassword, verificationToken, tokenExpires]
    );

    const user = newUser.rows[0];
    console.log('[SIGNUP] Пользователь успешно создан в БД, id =', user.id);

    // ←←←←←←←←←←←←←←←←←←←←←←←←←←
    console.log('[SIGNUP] Вызываем отправку письма...');
    await sendVerificationEmail(email, verificationToken);
    console.log('[SIGNUP] Письмо отправлено успешно!');
    // ←←←←←←←←←←←←←←←←←←←←←←←←←←

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
      success: true,
      message: 'Регистрация прошла успешно. Проверьте вашу почту для подтверждения email.',
      data: { token, user: { ...user, is_verified: false } }
    });

  } catch (error: any) {
    console.error('[SIGNUP] ОШИБКА:', error.message);
    next(error);
  }
};

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      const error = new Error('Неверный email или пароль');
      (error as any).statusCode = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      const error = new Error('Неверный email или пароль');
      (error as any).statusCode = 401;
      throw error;
    }

    if (!user.is_active) {
      const error = new Error('Ваш аккаунт заблокирован');
      (error as any).statusCode = 403;
      throw error;
    }

    // Проверка верификации email
    if (!user.is_verified) {
      const error = new Error('Пожалуйста, подтвердите ваш email перед входом в систему');
      (error as any).statusCode = 403;
      throw error;
    }

    await pool.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);

    const token = jwt.sign(
      { userId: user.id, is_verified: true }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );

    // Удаляем чувствительные данные
    delete user.password_hash;
    delete user.verification_token;
    delete user.verification_token_expires;

    res.status(200).json({
      success: true,
      message: 'Вход выполнен успешно',
      data: { token, user }
    });
  } catch (error) {
    next(error);
  }
};

// Подтверждение email
export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.query as { token?: string };

  if (!token) {
    return res.status(400).json({ success: false, message: 'Токен отсутствует' });
  }

  try {
    const result = await pool.query(
      `SELECT id FROM users 
       WHERE verification_token = $1 
       AND verification_token_expires > NOW()`,
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Неверный или просроченный токен подтверждения' 
      });
    }

    await pool.query(
      `UPDATE users 
       SET is_verified = true, 
           verification_token = NULL, 
           verification_token_expires = NULL 
       WHERE id = $1`,
      [result.rows[0].id]
    );

    res.json({ success: true, message: 'Email успешно подтверждён!' });
  } catch (error) {
    next(error);
  }
};

// Повторная отправка письма
export const resendVerification = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  try {
    const userResult = await pool.query(
      'SELECT id, is_verified FROM users WHERE email = $1', 
      [email]
    );

    const user = userResult.rows[0];
    if (!user) return res.status(404).json({ success: false, message: 'Пользователь не найден' });
    if (user.is_verified) return res.status(400).json({ success: false, message: 'Email уже подтверждён' });

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await pool.query(
      `UPDATE users 
       SET verification_token = $1, verification_token_expires = $2 
       WHERE id = $3`,
      [verificationToken, tokenExpires, user.id]
    );

    await sendVerificationEmail(email, verificationToken);

    res.json({ success: true, message: 'Письмо с подтверждением отправлено повторно' });
  } catch (error) {
    next(error);
  }
};