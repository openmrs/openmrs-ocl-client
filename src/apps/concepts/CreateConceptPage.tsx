import React from "react";
import { Grid } from "@material-ui/core";
import { ConceptForm } from "./components";
import { AppState } from "../../redux";
import {
  upsertConceptAndMappingsAction,
  upsertConceptErrorsSelector,
  upsertConceptAndMappingsLoadingSelector
} from "./redux";
import { APIConcept, apiConceptToConcept, APIMapping, BaseConcept } from './types'
import { usePrevious, useQuery } from "../../utils";
import { Redirect, useLocation } from "react-router";
import { connect } from "react-redux";
import { CONTEXT } from "./constants";

interface Props {
  loading: boolean;
  newConcept?: APIConcept;
  mappings: APIMapping[];
  errors?: {};
  createConcept: Function;
}

const CreateConceptPage: React.FC<Props> = ({
  createConcept,
  newConcept,
  mappings,
  loading,
  errors
}) => {
  const { pathname: url } = useLocation();
  const { conceptClass } = useQuery();
  const sourceUrl = url.replace("concepts/new/", "");

  const previouslyLoading = usePrevious(loading);

  let context = CONTEXT.create;

  if (!loading && previouslyLoading) {
    if (newConcept) {
      if (!errors) return <Redirect to={newConcept.url}/>;
      else context = CONTEXT.edit;
    }
  }

  return (
    <Grid item xs={8} component="div">
      <ConceptForm
        conceptClass={conceptClass}
        savedValues={apiConceptToConcept(newConcept, mappings)}
        context={context}
        onSubmit={(data: BaseConcept) => createConcept(data, sourceUrl)}
        loading={loading}
        errors={errors}
      />
    </Grid>
  );
};

const mapStateToProps = (state: AppState) => ({
  newConcept: state.concepts.upsertedConcept,
  mappings: state.concepts.mappings,
  loading: upsertConceptAndMappingsLoadingSelector(state),
  errors: upsertConceptErrorsSelector(state)
});

const mapActionsToProps = {
  createConcept: upsertConceptAndMappingsAction
};

export default connect(mapStateToProps, mapActionsToProps)(CreateConceptPage);
