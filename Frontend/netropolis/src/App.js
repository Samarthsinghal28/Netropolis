
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Dashboard from './dashboard';
import Login from './login';
import Register from './register';
import QuestList from './questList';
import QuestSearch from './questSearch';
import Requests from './requests';
import QuestCreate from './questCreate';
import MyRequests from './myRequests';
// import dotenv from 'dotenv';



function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emailID,setEmailId] = useState("");
  const [loginManager,setAsManager] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing authentication on app load
  useEffect(() => {
    const checkExistingAuth = () => {
      try {
        const authData = localStorage.getItem('authData');
        if (authData) {
          const parsed = JSON.parse(authData);
          // Check if the auth data is not too old (24 hours)
          const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
          if (Date.now() - parsed.timestamp < maxAge) {
            setIsAuthenticated(true);
            setEmailId(parsed.email);
            setAsManager(parsed.isManager || false);
          } else {
            // Clear expired auth data
            localStorage.removeItem('authData');
          }
        }
      } catch (error) {
        console.error('Error reading auth data:', error);
        localStorage.removeItem('authData');
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingAuth();
  }, []);

  const handleLogin = (authenticated, email, isManager) => {
    setIsAuthenticated(authenticated);
    if (email) setEmailId(email);
    if (isManager !== undefined) setAsManager(isManager);
  };

  const handleSignOut = () => {
    // Clear all authentication state
    setIsAuthenticated(false);
    setEmailId("");
    setAsManager(false);
    // Clear stored auth data
    localStorage.removeItem('authData');
    
    // TODO: Call backend logout endpoint
  };

  const ProtectedRoute = ({ element, requireManager = false }) => {
    if (isLoading) {
      return <div>Loading...</div>;
    }
    
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    
    if (requireManager && !loginManager) {
      return <Navigate to="/" />;
    }
    
    return element;
  };

  const LoginRoute = ({ element }) => {
    if (isLoading) {
      return <div>Loading...</div>;
    }
    // Redirect to the dashboard if the user is already authenticated
    return isAuthenticated ? <Navigate to="/" /> : element;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  
  return (
     
    <Router>
      <div className="App">
        
        <Routes>
          <Route path="/login" element={<LoginRoute element={<Login onLogin={handleLogin} setEmail={setEmailId} setManager={setAsManager} formStatus={isAuthenticated}/>} />} />
          <Route path="/register" element={<LoginRoute element={<Register/>} />} />
          <Route path="/" element={<ProtectedRoute element={<Dashboard formStatus={isAuthenticated} onLogout={handleSignOut} email={emailID} manager={loginManager} />} />} />
          <Route path="/questList" element={<ProtectedRoute element={<QuestList formStatus={isAuthenticated} email={emailID}/>} />}/>
          <Route path="/questSearch" element={<ProtectedRoute element={<QuestSearch/>} />}/>
          <Route path="/requests" element={<ProtectedRoute requireManager={true} element={<Requests email={emailID} formStatus={isAuthenticated} manager={loginManager}/>} />}/>
          <Route path="/questCreate" element={<ProtectedRoute requireManager={true} element={<QuestCreate formStatus={isAuthenticated} manager={loginManager}/>} />}/>     
          <Route path="/myRequests" element={<ProtectedRoute element={<MyRequests email={emailID} formStatus={isAuthenticated} manager={loginManager}/>} />}/>  
        </Routes>
        
      </div>
    </Router>
    
    
  );
    }

export default App;
