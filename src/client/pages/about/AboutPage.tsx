import React from 'react';
import styles from './AboutPage.module.scss';

const techStack = [
  { title: 'React & TS', desc: 'Строгая типизация и компонентный подход для надежного фронтенда.' },
  { title: 'Node & Express', desc: 'Масштабируемый бэкенд с REST API архитектурой.' },
  { title: 'PostgreSQL', desc: 'Мощная реляционная база данных для хранения ваших задач.' },
  { title: 'SCSS Modules', desc: 'Изолированные стили с поддержкой переменных и вложенности.' }
];

export const AboutPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <p className={styles.description}>
        Это не просто список дел. Это полноценное Fullstack-решение, созданное 
        с упором на производительность и чистый код.
      </p>

      <div className={styles.grid}>
        {techStack.map((tech, index) => (
          <div key={index} className={styles.card}>
            <h3>{tech.title}</h3>
            <p>{tech.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};