import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import {
  EditDictionaryPage,
  ViewDictionaryPage,
  ViewPersonalDictionariesPage
} from "./pages";
import AddBulkConceptsPage from "./pages/AddBulkConceptsPage";

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
          <ViewDictionaryPage />
        </Route>
      )}
      {!editDictionary ? null : (
        <Route exact path={`${path}/:collection/edit/`}>
          <EditDictionaryPage />
        </Route>
      )}
      {!concepts ? null : (
        <>
          <Route exact path={`${path}/:collection/add/`}>
            <AddBulkConceptsPage />
          </Route>
        </>
      )}
    </Switch>
  );
};

export default Routes;
