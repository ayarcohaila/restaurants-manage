import React from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import LoginPage from './login';
import SignupPage from './signup';

const Auth = () => (
  <div className="auth-app">
    <Switch>
      <Route exact path="/login" component={LoginPage} />
      <Route exact path="/signup" component={SignupPage} />
      <Route render={() => <Redirect to="/login" />} />
    </Switch>
  </div>
);

export default withRouter(Auth);
