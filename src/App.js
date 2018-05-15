import React, { Component } from 'react';
import Notifications from 'react-notify-toast';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import store from './Reducers/Index';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import SideNavigation from './components/SideNavigation';
import './App.css';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div className="App">
            <Notifications />
            <Navbar />
            <SideNavigation />
            <Switch>
              <Route exact path="/" component={Login} />
              <Route exact path="/dashboard" component={Dashboard} />
            </Switch>
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
