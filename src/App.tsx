import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import {AuthenticationRequired, LoginPage} from "./apps/authentication";
import {Provider} from "react-redux";
import store from "./store";
import NavDrawer from './NavDrawer';

const AuthenticatedRoutes: React.FC = () => {
    return (
        <Router>
            <Switch>
                <Route exact path="/">
                    Home
                </Route>
            </Switch>
        </Router>
    );
};

const Routes: React.FC = () => {
  return (
      <Router>
          <Switch>
              <Route exact path="/login">
                  <LoginPage />
              </Route>
              <Route path="/">
                  <AuthenticationRequired>
                      <NavDrawer><AuthenticatedRoutes/></NavDrawer>
                  </AuthenticationRequired>
              </Route>
          </Switch>
      </Router>
  );
};

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <Routes/>
        </Provider>
    );
};

export default App;
