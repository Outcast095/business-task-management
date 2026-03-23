/// это файл 'index.tsx
/// он расположен по адресу src/client/index.tsx

import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/App.scss';
import App from './App';


const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
