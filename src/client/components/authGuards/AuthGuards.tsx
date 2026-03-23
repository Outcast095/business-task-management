import React from 'react';
import { Navigate } from 'react-router-dom';

// 1. Защита страниц для авторизованных (Todos, Profile)
export const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" replace />;
};

// 2. Редирект с /auth, если пользователь уже вошел
export const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  // Если токен есть, отправляем на его страницу задач
  return token && user.id ? <Navigate to={`/todos/${user.id}`} replace /> : <>{children}</>;
};