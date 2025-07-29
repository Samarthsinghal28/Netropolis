import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

function NewAuthenticationPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleLogin = () => {
    // Implement login logic here
    console.log('Logging in with', email, password);
    history.push('/dashboard');
  };

  return (
    <div className="auth-page">
      <h1>Login</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" onClick={handleLogin}>
          Login
        </button>
      </form>
    </div>
  );
}

export default NewAuthenticationPage;