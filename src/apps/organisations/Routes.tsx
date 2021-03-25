import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";

import {
  ViewPublicOrganisationsPage
} from "./pages";

const Routes: React.FC = () => {
  let { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={`${path}/`}>
        <ViewPublicOrganisationsPage />
      </Route>
   
    </Switch>
  );
};

export default Routes;
