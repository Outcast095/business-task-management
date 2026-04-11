# Business Task Management

Современное fullstack-приложение для управления бизнес-задачами и профилем пользователя.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

## ✨ Основные возможности

- **Полная авторизация** — регистрация, вход, выход
- **Подтверждение email** через Resend
- **Личный профиль** с загрузкой и сменой аватара (Multer + Sharp)
- **Управление задачами** — создание, редактирование, удаление, пагинация
- **Статистика** по выполненным задачам
- **Удаление аккаунта** со всеми данными и аватаркой
- Полностью типизированный код (frontend + backend)

## 🛠 Технологический стек

### Frontend

- React 19 + TypeScript
- React Router DOM v7
- SCSS + PostCSS + clsx
- Webpack 5 (отдельные конфиги для dev/prod)
- react-dropzone (для загрузки аватара)

### Backend

- Express + TypeScript
- PostgreSQL + pg
- JWT + bcryptjs
- Multer + Sharp (обработка и оптимизация изображений)
- Resend (подтверждение email)
- Nodemon + ts-node/esm

### Инструменты

- ESLint + Prettier
- Webpack aliases
- Environment variables (.env)

## 🚀 Быстрый запуск

### 1. Клонирование репозитория

```bash
git clone https://github.com/Outcast095/business-task-management.git
cd business-task-management
```
