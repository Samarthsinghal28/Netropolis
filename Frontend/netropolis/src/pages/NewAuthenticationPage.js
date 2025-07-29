import React from 'react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

function NewAuthenticationPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleLogin = () => {
    // Implement authentication logic here
    if (username === 'admin' && password === 'password') {
      history.push('/dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="auth-page">
      <h1>Login</h1>
      <div>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default NewAuthenticationPage;