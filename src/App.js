import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function NewAuthenticationPage() {
  return (
    <div>
      <h1>New Authentication Page</h1>
      <form>
        <div>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/auth" component={NewAuthenticationPage} />
      </Switch>
    </Router>
  );
}

export default App;