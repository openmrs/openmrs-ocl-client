import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { ViewSourcePage, EditSourcePage } from "./pages";

interface Props {
  viewSource?: boolean;
  editSource?: boolean;
  concepts: boolean;
}

const Routes: React.FC<Props> = ({
  viewSource = true,
  editSource = true,
  concepts = true
}) => {
  let { path } = useRouteMatch();
  return (
    <Switch>
      {!viewSource ? null : (
        <Route exact path={`${path}/:source/`}>
          <ViewSourcePage />
        </Route>
      )}
      {!editSource ? null : (
        <Route exact path={`${path}/:source/edit/`}>
          <EditSourcePage />
        </Route>
      )}
    </Switch>
  );
};

export default Routes;
