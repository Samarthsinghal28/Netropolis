import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { io } from "socket.io-client";
import './App.css';
import Dashboard from './dashboard';
import Login from './login';
import Register from './register';
import QuestList from './questList';
import QuestRegister from './questRegister';
import QuestScheduling from './questSchedule';
import RegisteredQuests from './registeredQuests';
import Profile from './profile';
import MyRequests from './myRequests';

function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={toggleTheme}>
          Switch to {theme === 'light' ? 'dark' : 'light'} mode
        </button>
      </header>
      <Router>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/quests" element={<QuestList />} />
          <Route path="/quest-register" element={<QuestRegister />} />
          <Route path="/quest-schedule" element={<QuestScheduling />} />
          <Route path="/registered-quests" element={<RegisteredQuests />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-requests" element={<MyRequests />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
