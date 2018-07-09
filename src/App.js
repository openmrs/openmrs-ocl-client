import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import store from './redux/reducers/store';
import './App.css';
import './components/dashboard/components/dictionary/styles/dictionary-modal.css';
import Login from './components/login/container';
import Authenticate from './components/Auth';
import SourceSearch from './components/dashboard/container/SourceSearch';
import ConceptSearch from './components/dashboard/container/Concepts';
import DictionaryDisplay from './components/dashboard/container/DictionariesDisplay';
import SpecificConcept from './components/dashboard/container/SpecificConcept';
import DictionaryConcepts from './components/dictionaryConcepts/containers/DictionaryConcepts';
import CreateConcept from './components/dictionaryConcepts/containers/CreateConcept';
import NotFound from './components/NotFound';
import DictionaryOverview from './components/dashboard/components/dictionary/DictionaryContainer';

const App = () => (
  <Provider store={store}>
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Switch>
          <Route exact path="/" component={Authenticate(Login)} />
          <Route exact path="/dashboard" component={Authenticate(DictionaryDisplay)} />
          <Route exact path="/dashboard/sources" component={Authenticate(SourceSearch)} />
          <Route exact path="/dashboard/concepts" component={Authenticate(ConceptSearch)} />
          <Route exact path="/dashboard/dictionaries" component={Authenticate(DictionaryDisplay)} />
          <Route exact path="/dashboard/concepts/:ownerType/:organization/:name" component={Authenticate(SpecificConcept)} />
          <Route exact path="/concepts/:type/:typeName/:collectionName" component={Authenticate(DictionaryConcepts)} />
          <Route exact path="/dictionary-details" component={Authenticate(DictionaryOverview)} />
          <Route exact path="/concepts/:type/:typeName/:collectionName/new/:conceptType?" component={Authenticate(CreateConcept)} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </BrowserRouter>
  </Provider>
);
export default App;
