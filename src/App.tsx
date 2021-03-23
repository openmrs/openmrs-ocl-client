import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { AuthenticationRequired, LoginPage } from "./apps/authentication";
import { Provider } from "react-redux";
import store from "./redux";
import { InProgressPage } from "./apps/notifications";
import { NavDrawer } from "./components";
import DictionaryRoutes, {
  CreateDictionaryPage,
  ViewPublicDictionariesPage,
} from "./apps/dictionaries";
import ConceptRoutes, {
  DICTIONARY_CONTAINER,
  DICTIONARY_VERSION_CONTAINER,
} from "./apps/concepts";
import {
  SOURCE_CONTAINER,
  SOURCE_VERSION_CONTAINER,
} from "./apps/concepts/constants";
import {
  ViewOrgDictionariesPage,
  ViewPersonalDictionariesPage,
} from "./apps/dictionaries/pages";
import OrgsRoutes, { 
  ViewPublicOrganisationsPage, 
  CreateOrganisationPage, 
  ViewPersonalOrganisationsPage, 
  ViewOrganisationPage,
  EditOrganisationPage } from "./apps/organisations";
import { ViewPersonalSourcesPage } from "./apps/sources/pages";
import ViewOrgSourcesPage from "./apps/sources/pages/ViewOrgSourcesPage";
import ViewPublicSourcesPage from "./apps/sources/pages/ViewPublicSourcesPage";
import { ViewUserProfilePage } from "./apps/authentication/pages";

import SourceRoutes from "./apps/sources";
import CreateSourcePage from "./apps/sources/pages/CreateSourcePage";

const AuthenticatedRoutes: React.FC = () => {
  return (
    <Switch>
      <Route exact path='/user/'>
        <ViewUserProfilePage />
      </Route>
      <Route exact path='/user/orgs/'>
        <ViewPersonalOrganisationsPage />
      </Route>
      <Route exact path='/orgs/'>
        <ViewPublicOrganisationsPage />
      </Route>
      <Route exact path='/orgs/new/'>
          <CreateOrganisationPage />
      </Route>
      <Route exact path='/actions/' component={InProgressPage} />
      <Route path='/collections/new/'>
          <CreateDictionaryPage />
      </Route>
      <Route exact path='/orgs/:org/'>
         <ViewOrganisationPage />
      </Route>
      <Route exact path='/orgs/:org/edit/'>
         <EditOrganisationPage />
       </Route>
      <Route exact path='/user'>
        <OrgsRoutes />
      </Route>
      <Route exact path='/user/collections/'>
        <ViewPersonalDictionariesPage />
      </Route>
      <Route exact path='/user/orgs/collections/'>
        <ViewOrgDictionariesPage />
      </Route>
      <Route exact path='/collections/'>
        <ViewPublicDictionariesPage />
      </Route>
      <Route exact path='/user/sources/'>
        <ViewPersonalSourcesPage />
      </Route>
      <Route exact path='/user/orgs/sources/'>
        <ViewOrgSourcesPage />
      </Route>
      <Route exact path='/sources/'>
        <ViewPublicSourcesPage />
      </Route>
      <Route exact path='/sources/new/'>
          <CreateSourcePage />
      </Route>
      <Route path='/:ownerType/:owner/sources/:source/concepts'>
        <ConceptRoutes
          containerType={SOURCE_CONTAINER}
          editConcept={true}
          newConcept={true}
          viewConcept={true}
          viewConcepts={true}
          viewDictConcepts={false}
        />
      </Route>
      <Route path='/:ownerType/:owner/collections/:collection/concepts'>
        <ConceptRoutes
          containerType={DICTIONARY_CONTAINER}
          viewConcepts={true}
          viewDictConcepts={true}
        />
      </Route>
      <Route path='/:ownerType/:owner/collections/:collection/:version/concepts'>
        <ConceptRoutes
          containerType={DICTIONARY_VERSION_CONTAINER}
          viewConcepts={true}
        />
      </Route>
      <Route path='/:ownerType/:owner/sources/:source/:version/concepts'>
        <ConceptRoutes
          containerType={SOURCE_VERSION_CONTAINER}
          viewConcepts={true}
        />
      </Route>
      <Route path='/concepts'>
        <ConceptRoutes containerType={SOURCE_CONTAINER} viewConcepts={true} />
      </Route>
      <Route
        path='/:ownerType/:owner/collections'
        component={DictionaryRoutes}
      />
      <Route exact path='/'>
        <Redirect to='/user/collections/' />
      </Route>
      <Route path='/:ownerType/:owner/sources' component={SourceRoutes} />
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
        <Route exact path='/login'>
          <LoginPage />
        </Route>
        <Route path='/'>
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
