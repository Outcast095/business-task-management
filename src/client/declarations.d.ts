// declarations.d.ts
// Глобальные типы для импорта файлов, которых TypeScript не знает по умолчанию

// ====================== ИЗОБРАЖЕНИЯ ======================
declare module "*.png" {
  const value: string;
  export default value;
}

declare module "*.jpg" {
  const value: string;
  export default value;
}

declare module "*.jpeg" {
  const value: string;
  export default value;
}

declare module "*.svg" {
  const value: string;
  export default value;
}

declare module "*.gif" {
  const value: string;
  export default value;
}

// ====================== СТИЛИ ======================

// Глобальные стили (side-effect import)
declare module "*.scss";
declare module "*.sass";
declare module "*.css";

// CSS Modules (импорт как объекта)
declare module "*.module.scss" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.module.sass" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}