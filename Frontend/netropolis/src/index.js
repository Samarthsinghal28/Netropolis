import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Initialize theme from local storage
const savedTheme = localStorage.getItem('theme') || 'light';
document.body.className = savedTheme;

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
