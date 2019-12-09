import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import Header from "../../components/Header";
import AddBulkConceptsPage from "./AddBulkConceptsPage";

const Routes: React.FC = () => {
  // @ts-ignore
  let { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={`${path}/:collection/add/`}>
        <Header title="Add bulk concepts">
          <AddBulkConceptsPage />
        </Header>
      </Route>
    </Switch>
  );
};

export default Routes;
