// src/server/controllers/auth.controller.ts

import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import pool from '../database/db.js';
import { sendVerificationEmail } from '../utils/email.service.js';
import type { User } from '../../shared/types/auth.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';
const ACCESS_TOKEN_EXPIRES = '15m';
const REFRESH_TOKEN_MAX_AGE = 30 * 24 * 60 * 60 * 1000;

// Вспомогательная функция генерации токенов
const generateTokens = async (userId: number) => {
  const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES });
  const refreshToken = crypto.randomBytes(40).toString('hex');
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_MAX_AGE);

  await pool.query(
    'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
    [userId, refreshToken, expiresAt]
  );

  return { accessToken, refreshToken };
};

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (userExists.rows.length > 0) {
      const error = new Error('Пользователь с таким email уже существует');
      (error as any).statusCode = 409;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const newUser = await pool.query(
      `INSERT INTO users 
       (name, email, password_hash, is_verified, verification_token, verification_token_expires) 
       VALUES ($1, $2, $3, false, $4, $5) 
       RETURNING id, name, email`,
      [name, email, hashedPassword, verificationToken, tokenExpires]
    );

    const user = newUser.rows[0];

    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      success: true,
      message: 'Регистрация успешна. Пожалуйста, подтвердите ваш email.',
      data: { user: { ...user, is_verified: false } }
    });
  } catch (error: any) {
    next(error);
  }
};

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      const error = new Error('Неверный email или пароль');
      (error as any).statusCode = 401;
      throw error;
    }

    if (!user.is_active) {
      const error = new Error('Ваш аккаунт заблокирован');
      (error as any).statusCode = 403;
      throw error;
    }

    if (!user.is_verified) {
      return res.status(403).json({
        success: false,
        code: 'EMAIL_NOT_VERIFIED',
        message: 'Пожалуйста, подтвердите ваш email перед входом'
      });
    }

    const { accessToken, refreshToken } = await generateTokens(user.id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: REFRESH_TOKEN_MAX_AGE
    });

    await pool.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);

    const { password_hash, verification_token, verification_token_expires, ...userData } = user;

    res.status(200).json({
      success: true,
      message: 'Вход выполнен успешно',
      data: { 
        token: accessToken, 
        user: userData as User 
      }
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ success: false, message: 'Сессия истекла' });
  }

  try {
    const result = await pool.query(
      'SELECT user_id FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()',
      [refreshToken]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ success: false, message: 'Невалидный refresh token' });
    }

    const userId = result.rows[0].user_id;

    await pool.query('DELETE FROM refresh_tokens WHERE token = $1', [refreshToken]);

    const { accessToken, refreshToken: newRefreshToken } = await generateTokens(userId);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: REFRESH_TOKEN_MAX_AGE
    });

    const userResult = await pool.query(
      `SELECT id, name, email, avatar_url, role, is_active, is_verified 
       FROM users WHERE id = $1`,
      [userId]
    );

    res.json({
      success: true,
      data: { 
        token: accessToken,
        user: userResult.rows[0]
      }
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.cookies;
  
  try {
    if (refreshToken) {
      await pool.query('DELETE FROM refresh_tokens WHERE token = $1', [refreshToken]);
    }
    res.clearCookie('refreshToken');
    res.json({ success: true, message: 'Вышли из системы' });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.query as { token?: string };

  if (!token) {
    return res.status(400).json({ success: false, message: 'Токен отсутствует' });
  }

  try {
    const result = await pool.query(
      'SELECT id FROM users WHERE verification_token = $1 AND verification_token_expires > NOW()',
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ success: false, message: 'Неверный или просроченный токен' });
    }

    await pool.query(
      'UPDATE users SET is_verified = true, verification_token = NULL, verification_token_expires = NULL WHERE id = $1',
      [result.rows[0].id]
    );

    res.json({ success: true, message: 'Email подтверждён!' });
  } catch (error) {
    next(error);
  }
};

export const resendVerification = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  try {
    const userResult = await pool.query('SELECT id, is_verified FROM users WHERE email = $1', [email]);
    const user = userResult.rows[0];

    if (!user) return res.status(404).json({ success: false, message: 'Пользователь не найден' });
    if (user.is_verified) return res.status(400).json({ success: false, message: 'Email уже подтверждён' });

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await pool.query(
      'UPDATE users SET verification_token = $1, verification_token_expires = $2 WHERE id = $3',
      [verificationToken, tokenExpires, user.id]
    );

    await sendVerificationEmail(email, verificationToken);
    res.json({ success: true, message: 'Письмо отправлено повторно' });
  } catch (error) {
    next(error);
  }
};