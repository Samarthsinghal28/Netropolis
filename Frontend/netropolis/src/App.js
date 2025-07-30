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
import RegisteredQuests from './registeredQuest';
import QuestSearch from './questSearch';
import Requests from './requests';
import QuestCreate from './questCreate';
import MyRequests from './myRequests';
import { login, logout, getCurrentUser } from './authService';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emailID, setEmailId] = useState("");
  const [loginManager, setAsManager] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setIsAuthenticated(true);
      setEmailId(user.email);
    }
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const response = await login(email, password);
      if (response.token) {
        setIsAuthenticated(true);
        setEmailId(email);
      }
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const handleSignOut = () => {
    logout();
    setIsAuthenticated(false);
    setEmailId("");
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Dashboard formStatus={isAuthenticated} onLogout={handleSignOut} email={emailID} manager={loginManager} />} />
          <Route path="/questList" element={<QuestList formStatus={isAuthenticated} email={emailID} />} />
          <Route path="/questSearch" element={<QuestSearch />} />
          <Route path="/requests" element={<Requests email={emailID} formStatus={isAuthenticated} manager={loginManager} />} />
          <Route path="/questCreate" element={<QuestCreate formStatus={isAuthenticated} manager={loginManager} />} />
          <Route path="/myRequests" element={<MyRequests email={emailID} formStatus={isAuthenticated} manager={loginManager} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
