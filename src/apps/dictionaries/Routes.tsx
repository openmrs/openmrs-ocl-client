import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import Header from "../../components/Header";
import { EditDictionaryPage, ViewDictionaryPage } from "./pages";
import { DICTIONARY_VERSION_CONTAINER } from "../concepts";
import AddBulkConceptsPage from "./pages/AddBulkConceptsPage";
import ConceptRoutes from "../concepts/Routes";

const Routes: React.FC = () => {
  // @ts-ignore
  let { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={`${path}/:collection/`}>
        <Header title="Details" justifyChildren="space-around">
          <ViewDictionaryPage />
        </Header>
      </Route>
      <Route exact path={`${path}/:collection/edit/`}>
        <EditDictionaryPage />
      </Route>
      <Route path={`${path}/:collection/:version/concepts/`}>
        <ConceptRoutes
          containerType={DICTIONARY_VERSION_CONTAINER}
          viewConcepts={true}
        />
      </Route>
      <Route exact path={`${path}/:collection/add/`}>
        <AddBulkConceptsPage />
      </Route>
    </Switch>
  );
};

export default Routes;
