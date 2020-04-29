import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import { AuthenticationRequired, LoginPage } from "./apps/authentication";
import { Provider } from "react-redux";
import store from "./redux";
import { Header, InProgressPage, NavDrawer } from "./components";
import DictionaryRoutes, {
  CreateDictionaryPage,
  ViewPublicDictionariesPage
} from "./apps/dictionaries";
import ConceptRoutes, {
  DICTIONARY_CONTAINER,
  DICTIONARY_VERSION_CONTAINER
} from "./apps/concepts";
import { SOURCE_CONTAINER } from "./apps/concepts/constants";
import { ViewOrgDictionariesPage, ViewPersonalDictionariesPage } from './apps/dictionaries/pages'

const AuthenticatedRoutes: React.FC = () => {
  return (
    <Switch>
      <Route exact path="/actions/" component={InProgressPage} />
      <Route exact path="/collections/new/">
        <Header title="Create Dictionary">
          <CreateDictionaryPage />
        </Header>
      </Route>
      <Route exact path="/user/collections/">
        <Header title="Your Dictionaries">
          <ViewPersonalDictionariesPage />
        </Header>
      </Route>
      <Route exact path="/user/orgs/collections/">
        <Header title="Your Organizations' Dictionaries">
          <ViewOrgDictionariesPage />
        </Header>
      </Route>
      <Route exact path="/collections/">
        <Header title="Public Dictionaries">
          <ViewPublicDictionariesPage />
        </Header>
      </Route>
      <Route path="/:ownerType/:owner/sources/:source/concepts">
        <ConceptRoutes
          containerType={SOURCE_CONTAINER}
          editConcept={true}
          newConcept={true}
          viewConcept={true}
          viewConcepts={true}
        />
      </Route>
      <Route path="/:ownerType/:owner/collections/:collection/concepts">
        <ConceptRoutes
          containerType={DICTIONARY_CONTAINER}
          viewConcepts={true}
        />
      </Route>
      <Route path="/:ownerType/:owner/collections/:collection/concepts">
        <ConceptRoutes
          containerType={DICTIONARY_VERSION_CONTAINER}
          viewConcepts={true}
        />
      </Route>
      <Route path="/concepts">
        <ConceptRoutes containerType={SOURCE_CONTAINER} viewConcepts={true} />
      </Route>
      <Route
        path="/:ownerType/:owner/collections"
        component={DictionaryRoutes}
      />
      <Route exact path="/">
        <Redirect to="/user/collections/" />
      </Route>
    </Switch>
  );
};

const Routes: React.FC = () => {
  /**
   * The goal for all routes in the application is to mirror the API as much as possible
   * Exceptions *should* have a good reason
   */
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
