import React from "react";
import { Grid } from "@material-ui/core";
import { ConceptForm } from "./components";
import { AppState } from "../../redux";
import {
  upsertConceptAndMappingsAction,
  upsertConceptErrorsSelector,
  upsertConceptAndMappingsLoadingSelector
} from "./redux";
import { APIConcept, BaseConcept } from "./types";
import { usePrevious, useQuery } from "../../utils";
import { Redirect, useLocation } from "react-router";
import { connect } from "react-redux";
import { CONTEXT } from "./constants";

interface Props {
  loading: boolean;
  newConcept?: APIConcept;
  errors?: {};
  createConcept: Function;
}

const CreateConceptPage: React.FC<Props> = ({
  createConcept,
  newConcept,
  loading,
  errors
}) => {
  const { pathname: url } = useLocation();
  const { conceptClass } = useQuery();
  const sourceUrl = url.replace("concepts/new/", "");

  const previouslyLoading = usePrevious(loading);

  if (!loading && previouslyLoading && !errors && newConcept) {
    return <Redirect to={newConcept.url} />;
  }

  return (
    <Grid item xs={8} component="div">
      <ConceptForm
        conceptClass={conceptClass}
        context={CONTEXT.create}
        onSubmit={(data: BaseConcept) => createConcept(data, sourceUrl)}
        loading={loading}
        errors={errors}
      />
    </Grid>
  );
};

const mapStateToProps = (state: AppState) => ({
  newConcept: state.concepts.upsertedConcept,
  loading: upsertConceptAndMappingsLoadingSelector(state),
  errors: upsertConceptErrorsSelector(state)
});

const mapActionsToProps = {
  createConcept: upsertConceptAndMappingsAction
};

export default connect(mapStateToProps, mapActionsToProps)(CreateConceptPage);
