import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css'; // Убедитесь, что этот файл существует

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  // Remove StrictMode temporarily for testing
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);