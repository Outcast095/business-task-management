//файл /App.tsx
//файл расположен по адресу src/client/App.tsx


import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { TodosPage } from './pages/todos/TodosPage';
import { LandingPage } from './pages/landing/LandingPage';
import { AuthPage } from './pages/auth/AuthPage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { EditPage } from './pages/editPage/EditPage';
import { AboutPage } from './pages/about/AboutPage';
import { NotFoundPage } from './pages/notFoundPage/NotFoundPage';
import { PrivateRoute, PublicRoute } from './components/authGuards/AuthGuards'; 
import { MainLayout } from './components/layouts/MainLayout';
// Используем относительный путь для чистоты, если алиасы иногда капризничают
import { VerifyEmailPage } from './pages/verifyEmail/VerifyEmailPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* 1. Публичные страницы без оберток */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Ограничиваем доступ для уже вошедших */}
        <Route path="/auth" element={
          <PublicRoute>
            <AuthPage />
          </PublicRoute>
        } />

        {/* Страница верификации — лучше держать отдельно от MainLayout, 
            чтобы не грузить лишние компоненты интерфейса (хедер/сайдбар) */}
        <Route path="/verify-email" element={<VerifyEmailPage />} />

        {/* 2. Защищенные страницы внутри общего лейаута */}
        <Route element={<MainLayout />}>
          <Route path="/todos/:userId" element={
            <PrivateRoute>
              <TodosPage />
            </PrivateRoute>
          } />
          
          <Route path="/profile" element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          } />
          
          <Route path="/edit/:userId" element={
            <PrivateRoute>
              <EditPage />
            </PrivateRoute>
          } />

          {/* About может быть доступен всем, но внутри лейаута для консистентности */}
          <Route path="/about" element={<AboutPage />} />
        </Route>

        {/* 404 Страница */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;