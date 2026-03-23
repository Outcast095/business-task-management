// файл /NotFoundPage.tsx
// файл расположен по адресу src/client/pages/NotFoundPage.tsx


import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/button/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div style={{ 
      textAlign: 'center', 
      marginTop: '100px', 
      color: 'white', 
      fontFamily: 'sans-serif' 
    }}>
      <h1 style={{ fontSize: '120px', margin: '0', color: '#ff4d4d' }}>404</h1>
      <h2 style={{ marginBottom: '20px' }}>Упс! Страница не найдена</h2>
      <p style={{ opacity: 0.6, marginBottom: '40px' }}>
        Похоже, вы забрели в неизведанные цифровые пустоши...
      </p>
      
      <Link to="/" style={{ textDecoration: 'none' }}>
        <Button color="blue">Вернуться на главную</Button>
      </Link>
    </div>
  );
};