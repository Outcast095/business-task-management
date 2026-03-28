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

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Публичные страницы БЕЗ хедера */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={
          <PublicRoute><AuthPage /></PublicRoute>
        } />

        {/* Защищенные страницы С хедером */}
        <Route element={<MainLayout />}>
          <Route path="/todos/:userId" element={
            <PrivateRoute><TodosPage /></PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute><ProfilePage /></PrivateRoute>
          } />
          
          {/* 2. Добавляем роут редактирования */}
          <Route path="/edit/:userId" element={
            <PrivateRoute><EditPage /></PrivateRoute>
          } />

          <Route path="/about" element={<AboutPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;