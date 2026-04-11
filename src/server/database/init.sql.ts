// мой файл init.sql.ts
// src/server/database/init.sql.ts


import pool from './db.js';

const initDB = async (): Promise<void> => {
  const queryText = `
    -- Таблица пользователей
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      avatar_url TEXT,
      role VARCHAR(20) DEFAULT 'user',
      is_active BOOLEAN DEFAULT true,
      
      -- Верификация email
      is_verified BOOLEAN DEFAULT false NOT NULL,
      verification_token TEXT,
      verification_token_expires TIMESTAMPTZ,
      
      last_login TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Таблица Refresh-токенов для безопасных сессий
    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token TEXT NOT NULL UNIQUE,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Таблица задач
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      completed BOOLEAN DEFAULT false,
      user_id INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Индексы для оптимизации
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_verification_token ON users(verification_token);
    CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token);
  `;

  try {
    await pool.query(queryText);
    console.log('--- Database Initialization ---');
    console.log('✅ Tables checked/created: users, refresh_tokens, tasks');
    console.log('✅ Indexes verified');
    console.log('-------------------------------');
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('❌ Ошибка инициализации БД:', err.message);
      
      if (err.message.includes('already exists')) {
        console.log('ℹ️ Некоторые элементы уже существуют — пропускаем создание.');
      }
    } else {
      console.error('❌ Непредвиденная ошибка при инициализации БД');
    }
  }
};

export default initDB;