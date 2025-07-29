import React from 'react';

function AuthenticationPage() {
  return (
    <div>
      <h1>Authentication Page</h1>
      <p>Please log in to access your account.</p>
      <form>
        <div>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" required />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default AuthenticationPage;