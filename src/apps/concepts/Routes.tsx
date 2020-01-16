import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import ViewConceptPage from "./ViewConceptPage";
import ViewConceptsPage from "./ViewConceptsPage";
import EditConceptPage from "./ConceptPage";
import { SOURCE_CONTAINER } from "./constants";

const Routes: React.FC = () => {
  // @ts-ignore
  let { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={`${path}/`}>
        <ViewConceptsPage containerType={SOURCE_CONTAINER} />
      </Route>
      <Route exact path={`${path}/new/`}>
        <EditConceptPage />
      </Route>
      <Route exact path={`${path}/:concept/`}>
        <ViewConceptPage />
      </Route>
      <Route exact path={`${path}/:concept/edit/`}>
        <EditConceptPage />
      </Route>
    </Switch>
  );
};

export default Routes;
