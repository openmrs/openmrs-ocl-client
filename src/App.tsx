import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { AuthenticationRequired, LoginPage } from './apps/authentication'
import { Provider } from 'react-redux'
import store from './redux'
import { Header, InProgressPage, NavDrawer } from './components'
import DictionaryRoutes, {
  CreateDictionaryPage,
  ViewDictionariesPage,
  ViewPublicDictionariesPage
} from './apps/dictionaries'
import ConceptRoutes, { DICTIONARY_VERSION_CONTAINER, ViewConceptsPage } from './apps/concepts'

const AuthenticatedRoutes: React.FC = () => {
  return (
    <Switch>
      <Route exact path="/actions/" component={InProgressPage} />
      <Route exact path="/collections/new/">
        <Header title="Create Dictionary">
          <CreateDictionaryPage />
        </Header>
      </Route>
      <Route exact path="/collections/">
        <Header title="Public Dictionaries">
          <ViewPublicDictionariesPage />
        </Header>
      </Route>
      <Route exact path="/user/collections/">
        <Header title="Your Dictionaries">
          <ViewDictionariesPage />
        </Header>
      </Route>
      <Route path="/:ownerType/:owner/sources/:source/concepts">
        <ConceptRoutes editConcept={true} newConcept={true} viewConcept={true} viewConcepts={true} />
      </Route>
      <Route path="/:ownerType/:owner/collections/:collection/concepts">
        <ConceptRoutes viewConcepts={true} />
      </Route>
      <Route
        path="/:ownerType/:owner/collections/:collection/concepts/"
        containerType={DICTIONARY_VERSION_CONTAINER}
        component={ViewConceptsPage}
      />
      <Route
        path="/:ownerType/:owner/collections"
        component={DictionaryRoutes}
      />
      <Route exact path="/">
        Home
      </Route>
    </Switch>
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
            {() => (
              <NavDrawer>
                <AuthenticatedRoutes />
              </NavDrawer>
            )}
          </AuthenticationRequired>
        </Route>
      </Switch>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Routes />
    </Provider>
  );
};

export default App;
