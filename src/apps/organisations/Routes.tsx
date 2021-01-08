import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";

import {
  ViewOrganisationsPage,
  EditOrganisationPage,
  ViewOrganisationPage
} from "./pages";

interface Props {
  editOrg?: boolean;
}

const Routes: React.FC<Props> = ({editOrg = true}) => {
  let { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={`${path}/`}>
        <ViewOrganisationsPage />
      </Route>
      {!editOrg ? null : (
        <Route path={`${path}/:org/edit/`}>
         <EditOrganisationPage />
       </Route>
      )
      }
      <Route path={`${path}/:org/`}>
         <ViewOrganisationPage />
      </Route>
   
    </Switch>
  );
};

export default Routes;
