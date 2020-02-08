import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import ViewConceptPage from "./ViewConceptPage";
import ViewConceptsPage from "./ViewConceptsPage";
import ConceptPage from "./ConceptPage";
import { DICTIONARY_CONTAINER } from "./constants";

interface Props {
  viewConcepts?: boolean;
  newConcept?: boolean;
  viewConcept?: boolean;
  editConcept?: boolean;
}

const Routes: React.FC<Props> = ({
  viewConcepts = false,
  newConcept = false,
  viewConcept = false,
  editConcept = false
}) => {
  // @ts-ignore
  let { path } = useRouteMatch();

  return (
    <Switch>
      {!viewConcepts ? null : (
        <Route exact path={`${path}/`}>
          <ViewConceptsPage containerType={DICTIONARY_CONTAINER} />
        </Route>
      )}
      {!newConcept ? null : (
        <Route exact path={`${path}/new/`}>
          <ConceptPage />
        </Route>
      )}
      {!viewConcept ? null : (
        <Route exact path={`${path}/:concept/:version/`}>
          <ViewConceptPage />
        </Route>
      )}
      {!editConcept ? null : (
        <Route exact path={`${path}/:concept/:version/edit/`}>
          <ConceptPage />
        </Route>
      )}
    </Switch>
  );
};

export default Routes;
