
// это файл edit.controller.ts
// расположен по адресу src/server/controllers/edit.controller.ts


import { Request, Response } from 'express';
import pool from '../database/db.js';
import bcrypt from 'bcryptjs';

/**
 * Контроллер для обновления профиля пользователя.
 * Обрабатывает изменение имени, почты, пароля и загрузку аватара.
 */
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { name, email, password } = req.body;
    
    // 1. ЛОГИКА АВАТАРА
    // Если пользователь загрузил новый файл (Multer положил его в req.file):
    // Формируем новую ссылку на изображение.
    // Если файла нет (req.file === undefined), оставляем старую ссылку из req.body.
    let avatarUrlToSave = req.body.avatar_url;

    if (req.file) {
      // Сохраняем путь, по которому Express будет отдавать статику (см. index.ts)
      avatarUrlToSave = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    console.log('Данные для обновления:', { name, email, avatarUrlToSave, hasFile: !!req.file });

    // 2. ПРОВЕРКА ПОЛЬЗОВАТЕЛЯ
    // Проверяем, существует ли в БД пользователь с таким ID, прежде чем что-то менять.
    const userCheck = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    let query: string;
    let params: any[];

    // 3. ФОРМИРОВАНИЕ SQL ЗАПРОСА
    // Если пришел пароль (и он не пустая строка), хешируем его и обновляем поле password_hash.
    if (password && password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Запрос со сменой пароля
      query = `
        UPDATE users 
        SET name = $1, email = $2, avatar_url = $3, password_hash = $4 
        WHERE id = $5 
        RETURNING id, name, email, avatar_url
      `;
      params = [name, email, avatarUrlToSave, hashedPassword, userId];
    } else {
      // Запрос БЕЗ смены пароля (чтобы не затереть существующий хеш в базе)
      query = `
        UPDATE users 
        SET name = $1, email = $2, avatar_url = $3 
        WHERE id = $4 
        RETURNING id, name, email, avatar_url
      `;
      params = [name, email, avatarUrlToSave, userId];
    }

    // Выполняем запрос к БД
    const updatedUser = await pool.query(query, params);
    
    // 4. ОТВЕТ КЛИЕНТУ
    // Возвращаем обновленный объект пользователя (без пароля!), чтобы фронтенд сразу обновил UI.
    res.json(updatedUser.rows[0]);

  } catch (err: any) {
    console.error('Ошибка в updateProfile:', err);
    res.status(500).json({ error: err.message });
  }
};