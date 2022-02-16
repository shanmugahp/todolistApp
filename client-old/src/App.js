import React, { Component } from "react";
import { Switch, useHistory,Route, Link } from "react-router-dom";
import AddItem from "./components/additem";
import Item from "./components/item";
import ItemsList from "./components/listitem";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { Security, SecureRoute, LoginCallback } from '@okta/okta-react';
import { Container } from 'semantic-ui-react';
import config from './config';
import CustomLoginComponent from './Login';
import CorsErrorModal from './CorsErrorModal';
import AuthRequiredModal from './AuthRequiredModal';
import Navbar from './Navbar';

const oktaAuth = new OktaAuth(config.oidc);

const App = () => {
  const [corsErrorModalOpen, setCorsErrorModalOpen] = React.useState(false);
  const [authRequiredModalOpen, setAuthRequiredModalOpen] = React.useState(false);

  const history = useHistory(); // example from react-router

  const triggerLogin = () => {
    // Redirect to the /login page that has a CustomLoginComponent
    history.push('/login');
  };

  const restoreOriginalUri = async (_oktaAuth, originalUri) => {
    history.replace(toRelativeUrl(originalUri || '/', window.location.origin));
  };

  const customAuthHandler = async () => {
    const previousAuthState = oktaAuth.authStateManager.getPreviousAuthState();
    if (!previousAuthState || !previousAuthState.isAuthenticated) {
      // App initialization stage
      triggerLogin();
    } else {
      // Ask the user to trigger the login process during token autoRenew process
      setAuthRequiredModalOpen(true);
    }
  };

  const onAuthResume = async () => {
    history.push('/login');
  };

  return (
    <Security
      oktaAuth={oktaAuth}
      onAuthRequired={customAuthHandler}
      restoreOriginalUri={restoreOriginalUri}
    >
      <div>


      <div>
      <CorsErrorModal {...{ corsErrorModalOpen, setCorsErrorModalOpen }} />
      <AuthRequiredModal {...{ authRequiredModalOpen, setAuthRequiredModalOpen, triggerLogin }} />
      <Container text style={{ marginTop: '7em' }}>
        <Switch>
          <Route path="/login/callback" render={(props) => <LoginCallback {...props} onAuthResume={onAuthResume} />} />
          <Route path="/login" render={() => <CustomLoginComponent {...{ setCorsErrorModalOpen }} />} />
          <SecureRoute exact path={["/", "/items"]} component={ItemsList} />
        </Switch>
      </Container>
        </div>
              </div>
    </Security>
  );
};

export default App;
