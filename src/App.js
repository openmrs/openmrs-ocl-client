import React from 'react';
import Notifications from 'react-notify-toast';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import store from './redux/reducers/store';
import './App.css';
import Login from './components/Login';
import Authenticate from './components/Auth';
import SourceSearch from './components/dashboard/container/SourceSearch';
import Concept from './components/dashboard/container/Concepts';

const App = () => (
  <Provider store={store}>
    <BrowserRouter>
      <div className="App">
        <Notifications />
        <Navbar />
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/dashboard" component={Authenticate(SourceSearch)} />
          <Route exact path="/dashboard/concepts" component={Authenticate(Concept)} />
        </Switch>
      </div>
    </BrowserRouter>
  </Provider>
);
export default App;
