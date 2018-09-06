import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Auth } from 'aws-amplify';

import AppliedRoute from './components/AppliedRoute';
import AuthenticatedRoute from './components/AuthenticatedRoute';
import UnauthenticatedRoute from './components/UnauthenticatedRoute';

import Home from './containers/Home';
import NotFound from './containers/NotFound';
import Login from './containers/Login';
import Signup from './containers/Signup';
import NewGame from './containers/NewGame';
import Games from './containers/Games';
import AuthComponent from './containers/AuthComponent';

export default ({ childProps }) => (
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <UnauthenticatedRoute
      path="/auth"
      exact
      component={AuthComponent}
      props={childProps}
    />
    <UnauthenticatedRoute
      path="/login"
      exact
      component={Login}
      props={childProps}
    />
    <UnauthenticatedRoute
      path="/signup"
      exact
      component={Signup}
      props={childProps}
    />
    <AuthenticatedRoute
      path="/games/new"
      exact
      component={NewGame}
      props={childProps}
    />
    <AuthenticatedRoute
      path="/games/:id"
      exact
      component={Games}
      props={childProps}
    />

    {/* Finally, catch all unmatched routes */}
    <Route component={NotFound} />
  </Switch>
);
