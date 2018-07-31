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
import OwnerDictionary from './components/dashboard/container/OwnerDictionary';
import GeneralSearchContainer from './components/GeneralSearch/GeneralSearchContainer';
import UserDashboard from './components/userDasboard/container/UserDashboard';
import LoginDetails from './components/login/container/LoginDetails';
import AddBulkConcepts from './components/bulkConcepts/addBulkConcepts';
import BulkConceptPage from './components/bulkConcepts/container/BulkConceptsPage';

const App = () => (
  <Provider store={store}>
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Switch>
          <Route exact path="/" component={Authenticate(Login)} />
          <Route exact path="/dashboard" component={Authenticate(UserDashboard)} />
          <Route exact path="/loginDetails" component={LoginDetails} />
          <Route exact path="/dashboard" component={Authenticate(OwnerDictionary)} />
          <Route exact path="/dashboard/sources" component={Authenticate(SourceSearch)} />
          <Route exact path="/dashboard/concepts" component={Authenticate(ConceptSearch)} />
          <Route exact path="/dashboard/dictionaries" component={Authenticate(DictionaryDisplay)} />
          <Route exact path="/dashboard/userdictionaries" component={Authenticate(OwnerDictionary)} />
          <Route exact path="/bulkconcepts" component={Authenticate(AddBulkConcepts)} />
          <Route exact path="/dashboard/concepts/:ownerType/:organization/:name" component={Authenticate(SpecificConcept)} />
          <Route exact path="/concepts/:ownerType/:organization/:name" component={Authenticate(BulkConceptPage)} />
          <Route exact path="/concepts/:type/:typeName/:collectionName/:dictionaryName/:language" component={Authenticate(DictionaryConcepts)} />
          <Route exact path="/dictionaryOverview/:ownerType/:owner/:type/:name" component={Authenticate(DictionaryOverview)} />
          <Route exact path="/concepts/:type/:typeName/:collectionName/:dictionaryName/:language/new/:conceptType?" component={Authenticate(CreateConcept)} />
          <Route exact path="/search/:query?" component={Authenticate(GeneralSearchContainer)} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </BrowserRouter>
  </Provider>
);
export default App;
