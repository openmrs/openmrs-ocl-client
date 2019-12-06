import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AuthenticationRequired, LoginPage } from "./apps/authentication";
import { Provider } from "react-redux";
import store from "./store";
import { NavDrawer } from "./components";
import DictionaryRoutes, {
  CreateDictionaryPage,
  ViewDictionariesPage,
  ViewPublicDictionariesPage
} from "./apps/dictionaries";
import CollectionRoutes from "./apps/collections";
import ConceptRoutes, {
  COLLECTION_CONTAINER,
  ViewConceptsPage
} from "./apps/concepts";
import { Header } from "./components";
import { InProgressPage } from "./components";

const AuthenticatedRoutes: React.FC = () => {
  return (
    <Switch>
      <Route exact path="/actions/" component={InProgressPage} />
      <Route exact path="/dictionaries/new/">
        <Header title="Create Dictionary">
          <CreateDictionaryPage />
        </Header>
      </Route>
      <Route exact path="/dictionaries/">
        <Header title="Public Dictionaries">
          <ViewPublicDictionariesPage />
        </Header>
      </Route>
      <Route exact path="/user/dictionaries/">
        <Header title="Your Dictionaries">
          <ViewDictionariesPage />
        </Header>
      </Route>
      <Route
        path="/:ownerType/:owner/dictionaries"
        component={DictionaryRoutes}
      />
      <Route
        path="/:ownerType/:owner/sources/:source/concepts"
        component={ConceptRoutes}
      />
      <Route
        path="/:ownerType/:owner/collections/:collection/concepts/"
        containerType={COLLECTION_CONTAINER}
        component={ViewConceptsPage}
      />
      <Route
        path="/:ownerType/:owner/collections"
        component={CollectionRoutes}
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
