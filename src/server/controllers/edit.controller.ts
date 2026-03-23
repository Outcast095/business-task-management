// src/server/controllers/edit.controller.ts
import { Request, Response } from 'express';
import pool from '../database/db.js';
import bcrypt from 'bcryptjs';

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { name, email, password, avatar_url } = req.body;
      
    console.log( name, email, password, avatar_url );
      
    // Сначала проверим, существует ли пользователь
    const userCheck = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    let query = 'UPDATE users SET name = $1, email = $2, avatar_url = $3';
    let params = [name, email, avatar_url, userId];

    // Если пришел новый пароль, хешируем его и добавляем в запрос
    if (password && password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // ИСПРАВЛЕНО: меняем password на password_hash
      query = 'UPDATE users SET name = $1, email = $2, avatar_url = $3, password_hash = $4 WHERE id = $5 RETURNING id, name, email, avatar_url';
      params = [name, email, avatar_url, hashedPassword, userId];
    } else {
      query += ' WHERE id = $4 RETURNING id, name, email, avatar_url';
    }

    const updatedUser = await pool.query(query, params);
    res.json(updatedUser.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};