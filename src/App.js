import React from 'react';
import Notifications from 'react-notify-toast';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import store from './redux/reducers/store';
import './App.css';
import './components/dashboard/components/dictionary/styles/dictionary-modal.css';
import Login from './components/Login';
import Authenticate from './components/Auth';
import SourceSearch from './components/dashboard/container/SourceSearch';
import ConceptSearch from './components/dashboard/container/Concepts';
import DictionaryDisplay from './components/dashboard/container/DictionariesDisplay';
import SpecificConcept from './components/dashboard/container/SpecificConcept';

const App = () => (
  <Provider store={store}>
    <BrowserRouter>
      <div className="App">
        <Notifications />
        <Navbar />
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/dashboard" component={Authenticate(SourceSearch)} />
          <Route exact path="/dashboard/concepts" component={Authenticate(ConceptSearch)} />
          <Route exact path="/dashboard/dictionaries" component={Authenticate(DictionaryDisplay)} />
          <Route exact path="/dashboard/concepts/:organization/:name" component={Authenticate(SpecificConcept)} />
        </Switch>
      </div>
    </BrowserRouter>
  </Provider>
);
export default App;
