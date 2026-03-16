import React from 'react';
import './style.scss'; // Импортируем без переменной
import spiderImg from '@/assets/images/spider.png';


function App() {
  return (
    // Используем просто строку с названием класса
    <div className="container"> 
      <p>Webpack теперь собирает и это.</p>
    </div>
  );
}

export default App;
