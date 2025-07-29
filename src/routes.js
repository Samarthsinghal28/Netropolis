import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NewAuthPage from './pages/NewAuthPage';

function Routes() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/auth" component={NewAuthPage} />
      </Switch>
    </Router>
  );
}

export default Routes;