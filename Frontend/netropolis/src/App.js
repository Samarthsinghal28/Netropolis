import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Dashboard from './dashboard';
import Register from './register';
import QuestList from './questList';
import QuestSearch from './questSearch';
import Requests from './requests';
import QuestCreate from './questCreate';
import MyRequests from './myRequests';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emailID, setEmailId] = useState("");
  const [loginManager, setAsManager] = useState(false);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Dashboard formStatus={isAuthenticated} onLogout={setIsAuthenticated} email={emailID} manager={loginManager} />} />
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