import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import {
  CreateOrEditConceptPage,
  ViewConceptPage,
  ViewConceptsPage
} from "./pages";

interface Props {
  viewConcepts?: boolean;
  newConcept?: boolean;
  viewConcept?: boolean;
  editConcept?: boolean;
  viewDictConcepts?: boolean;
  containerType: string;
}

const Routes: React.FC<Props> = ({
  containerType,
  viewConcepts = false,
  newConcept = false,
  viewConcept = false,
  editConcept = false,
  viewDictConcepts = false
}) => {
  let { path } = useRouteMatch();

  return (
    <Switch>
      {!viewConcepts ? null : (
        <Route exact path={`${path}/`}>
          <ViewConceptsPage
            key={containerType}
            containerType={containerType}
            viewDictConcepts={viewDictConcepts}
          />
        </Route>
      )}
      {!newConcept ? null : (
        <Route exact path={`${path}/new/`}>
          <CreateOrEditConceptPage />
        </Route>
      )}
      {!viewConcept ? null : (
        <Route exact path={`${path}/:concept/:version/`}>
          <ViewConceptPage />
        </Route>
      )}
      {!viewConcept ? null : (
        <Route exact path={`${path}/:concept/`}>
          <ViewConceptPage />
        </Route>
      )}
      {!editConcept ? null : (
        <Route exact path={`${path}/:concept/:version/edit/`}>
          <CreateOrEditConceptPage />
        </Route>
      )}
    </Switch>
  );
};

export default Routes;
