// src/client/api/auth.api.ts
// это файл auth.api.ts
// src/client/api/auth.api.ts
import axios from 'axios';

// Создаем экземпляр API
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, // Позволяет отправлять и получать HttpOnly Cookies (refreshToken)
});

/**
 * ИНТЕРЦЕПТОР ЗАПРОСА
 * Автоматически добавляет Access Token в заголовки каждого запроса
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * ИНТЕРЦЕПТОР ОТВЕТА
 * Ловит 401 ошибку и пытается обновить токен через Refresh Token
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Если сервер вернул 401 и мы еще не пробовали переповторить запрос
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Пробуем получить новый Access Token
        const response = await axios.post(
          'http://localhost:5000/api/auth/refresh',
          {},
          { withCredentials: true }
        );

        const { token } = response.data.data;

        // Сохраняем новый токен
        localStorage.setItem('token', token);

        // Обновляем заголовок в упавшем запросе и повторяем его
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Если даже refresh token просрочен — разлогиниваем пользователя
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/auth';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

/**
 * СЕРВИС АВТОРИЗАЦИИ
 */
export const AuthService = {
  // Регистрация
  register: async (userData: any) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },

  // Вход
  login: async (credentials: any) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },

  // Выход
  logout: async () => {
    const res = await api.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return res.data;
  },

  // Подтверждение email
  verifyEmail: async (token: string) => {
    const res = await api.get(`/auth/verify-email?token=${token}`);
    return res.data;
  },

  // Повторная отправка письма (если потребуется)
  resendVerification: async (email: string) => {
    const res = await api.post('/auth/resend-verification', { email });
    return res.data;
  }
};

export default api;