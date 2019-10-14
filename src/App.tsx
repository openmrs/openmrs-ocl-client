import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import {AuthenticationRequired, LoginPage} from "./authentication";
import {Provider} from "react-redux";
import store from "./store";

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
                      <AuthenticatedRoutes/>
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
