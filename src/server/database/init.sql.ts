// мой файл init.sql.ts
// src/server/database/init.sql.ts

import pool from './db.js';

const initDB = async (): Promise<void> => {
  const queryText = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    avatar_url TEXT,
    role VARCHAR(20) DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    completed BOOLEAN DEFAULT false,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`;

  try {
    await pool.query(queryText);
    console.log('✅ Структура базы данных готова: таблицы users и tasks проверены');
  } catch (err: unknown) {
    if (err instanceof Error) {
      // Если таблица tasks уже была без user_id, база может выдать ошибку.
      // В реальной разработке для этого используют миграции, 
      // но сейчас мы просто выведем понятное сообщение.
      console.error('❌ Ошибка инициализации БД:', err.message);
      console.log('💡 Совет: если вы изменили структуру существующей таблицы, возможно, её нужно удалить (DROP TABLE tasks) и запустить сервер снова.');
    } else {
      console.error('❌ Непредвиденная ошибка при инициализации БД');
    }
    process.exit(1); 
  }
};

export default initDB;