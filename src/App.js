import React from 'react';
import Notifications from 'react-notify-toast';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import store from './Reducers/Index';
import './App.css';
import { Login } from './components/Login';
import Dashboard from './components/Dashboard';

const App = () => (
  <Provider store={store}>
    <BrowserRouter>
      <div className="App">
        <Notifications />
        <Navbar />
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/dashboard" component={Dashboard} />
        </Switch>
      </div>
    </BrowserRouter>
  </Provider>
);
export default App;
