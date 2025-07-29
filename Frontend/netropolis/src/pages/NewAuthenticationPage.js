import React from 'react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

function NewAuthenticationPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleLogin = () => {
    // Add authentication logic here
    if (email && password) {
      // Simulate successful login
      history.push('/dashboard');
    } else {
      alert('Please enter email and password');
    }
  };

  return (
    <div className="auth-page">
      <h1>Login</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default NewAuthenticationPage;