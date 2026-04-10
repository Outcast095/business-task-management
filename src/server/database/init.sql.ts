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
      
      -- === Новые поля для верификации email ===
      is_verified BOOLEAN DEFAULT false NOT NULL,
      verification_token TEXT,
      verification_token_expires TIMESTAMPTZ,
      
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

    -- Индексы для ускорения поиска (опционально, но полезно)
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_verification_token ON users(verification_token);
  `;

  try {
    await pool.query(queryText);
    console.log('✅ Структура базы данных готова: таблицы users и tasks проверены');
    console.log('✅ Добавлены поля: is_verified, verification_token, verification_token_expires');
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('❌ Ошибка инициализации БД:', err.message);
      
      if (err.message.includes('already exists')) {
        console.log('ℹ️  Некоторые таблицы или столбцы уже существуют — это нормально.');
      }
    } else {
      console.error('❌ Непредвиденная ошибка при инициализации БД');
    }
    // Не завершаем процесс, чтобы сервер мог запуститься даже при мелких предупреждениях
  }
};

export default initDB;