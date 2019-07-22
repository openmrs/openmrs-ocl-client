/* eslint-disable react/jsx-indent */
import React, { Fragment } from 'react';
import { Provider } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import store from './redux/reducers/store';
import Login from './components/login/container';
import Authenticate from './components/Auth';
import DictionaryDisplay from './components/dashboard/container/DictionariesDisplay';
import DictionaryConcepts from './components/dictionaryConcepts/containers/DictionaryConcepts';
import CreateConcept from './components/dictionaryConcepts/containers/CreateConcept';
import EditConcept from './components/dictionaryConcepts/containers/EditConcept';
import NotFound from './components/NotFound';
import DictionaryOverview from './components/dashboard/components/dictionary/DictionaryContainer';
import GeneralSearchContainer from './components/GeneralSearch/GeneralSearchContainer';
import UserDashboard from './components/userDasboard/container/UserDashboard';
import LoginDetails from './components/login/container/LoginDetails';
import AddBulkConcepts from './components/bulkConcepts/addBulkConcepts';
import BulkConceptPage from './components/bulkConcepts/container/BulkConceptsPage';
import { Signup } from './components/Signup/components/container';
import Notifications from './components/Notifications';
import history from './config/history';

const App = () => (
  <Provider store={store}>
    <Router history={history}>
      <Fragment>
        <div className="App">
          <Navbar />
          <Notifications />
          <Switch>
            <Route exact path="/" component={Authenticate(Login)} />
            <Route exact path="/home" component={Authenticate(UserDashboard)} />
            <Route exact path="/loginDetails" component={LoginDetails} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/dashboard/dictionaries" component={Authenticate(DictionaryDisplay)} />
            <Route
              exact
              path="/bulk/concepts/:type/:typeName/:collectionName/:dictionaryName/:language"
              component={Authenticate(AddBulkConcepts)}
            />
            <Route
              exact
              path="/import/concepts/:type/:typeName/:collectionName/:dictionaryName/:language"
              component={Authenticate(BulkConceptPage)}
            />
            <Route
              exact
              path="/concepts/:type/:typeName/:collectionName/:dictionaryName/:language"
              component={Authenticate(DictionaryConcepts)}
            />
            <Route
              exact
              path="/dictionaryOverview/:ownerType/:owner/:type/:name"
              component={Authenticate(DictionaryOverview)}
            />
            <Route
              exact
              // eslint-disable-next-line max-len
              path="/new/:conceptType?/concepts/:type/:typeName/:collectionName/:dictionaryName/:language/"
              component={Authenticate(CreateConcept)}
            />
            <Route
              exact
              // eslint-disable-next-line max-len
              path="/edit/:conceptType?/:conceptId/concepts/:type/:typeName/:collectionName/:dictionaryName/:language/"
              component={Authenticate(EditConcept)}
            />
            <Route
              exact
              path="/search/:query?"
              component={Authenticate(GeneralSearchContainer)}
            />
            <Route component={NotFound} />
          </Switch>
        </div>
      </Fragment>
    </Router>
  </Provider>
);
export default App;
