import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import Header from "../../components/Header";
import ViewDictionaryPage from "./ViewDictionaryPage";
import EditDictionaryPage from "./EditDictionaryPage";
import { DICTIONARY_CONTAINER, ViewConceptsPage } from "../concepts";

const Routes: React.FC = () => {
  // @ts-ignore
  let { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={`${path}/:dictionary/`}>
        <Header title="Details" justifyChildren="space-around">
          <ViewDictionaryPage />
        </Header>
      </Route>
      <Route exact path={`${path}/:dictionary/edit/`}>
        <Header title="Edit Dictionary">
          <EditDictionaryPage />
        </Header>
      </Route>
      <Route path={`${path}/:dictionary/:version/concepts/`}>
        <ViewConceptsPage containerType={DICTIONARY_CONTAINER} />
      </Route>
    </Switch>
  );
};

export default Routes;
