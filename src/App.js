import React, { Component } from 'react';
import Notifications from 'react-notify-toast';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import store from './Reducers/Index';
import './App.css';
import Login from './components/Login';
import Dashboard from './Components/Dashboard';
import Navigation from './Components/Navigation';
import SideNavigation from './Components/SideNavigation';
import './App.css';


class App extends Component {
  render() {
    return (
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
  }
}

export default App;
