import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import Header from "../../components/Header";
import {
  EditDictionaryPage,
  ViewDictionaryPage,
  ViewPersonalDictionariesPage
} from "./pages";
import { DICTIONARY_VERSION_CONTAINER } from "../concepts";
import AddBulkConceptsPage from "./pages/AddBulkConceptsPage";
import ConceptRoutes from "../concepts/Routes";

interface Props {
  viewDictionaries?: boolean;
  viewDictionary?: boolean;
  editDictionary?: boolean;
  concepts: boolean;
}

const Routes: React.FC<Props> = ({
  viewDictionaries = true,
  viewDictionary = true,
  editDictionary = true,
  concepts = true
}) => {
  // @ts-ignore
  let { path } = useRouteMatch();

  return (
    <Switch>
      {!viewDictionaries ? null : (
        // see to do at the top of ViewPersonalDictionariesPage
        <Route exact path={`${path}/`}>
          <ViewPersonalDictionariesPage />
        </Route>
      )}
      {!viewDictionary ? null : (
        <Route exact path={`${path}/:collection/`}>
          <Header title="Details" justifyChildren="space-around">
            <ViewDictionaryPage />
          </Header>
        </Route>
      )}
      {!editDictionary ? null : (
        <Route exact path={`${path}/:collection/edit/`}>
          <EditDictionaryPage />
        </Route>
      )}
      {!concepts ? null : (
        <>
          <Route path={`${path}/:collection/:version/concepts/`}>
            <ConceptRoutes
              containerType={DICTIONARY_VERSION_CONTAINER}
              viewConcepts={true}
            />
          </Route>
          <Route exact path={`${path}/:collection/add/`}>
            <AddBulkConceptsPage />
          </Route>
        </>
      )}
    </Switch>
  );
};

export default Routes;
