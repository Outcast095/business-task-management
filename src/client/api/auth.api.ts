// src/client/api/auth.api.ts
// это файл auth.api.ts
const API_URL = 'http://localhost:5000/api/auth';

export const AuthService = {
  // Регистрация нового пользователя
  register: async (userData: any) => {
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Ошибка регистрации');
    return data;
  },

  // Вход в систему
  login: async (credentials: any) => {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Ошибка входа');
    return data;
  }
};