import React, { useEffect } from "react";
import { Grid } from "@material-ui/core";
import { ConceptForm } from "./components";
import { AppState } from "../../redux";
import {
  viewConceptLoadingSelector,
  viewConceptErrorsSelector,
  retrieveConceptAction,
  upsertConceptAndMappingsLoadingSelector,
  upsertConceptErrorsSelector,
  upsertConceptAndMappingsAction,
  upsertAllMappingsErrorSelector,
  upsertConceptAndMappingsProgressSelector
} from "./redux";
import { APIConcept, apiConceptToConcept, BaseConcept } from "./types";
import { Redirect, useLocation, useParams } from "react-router";
import { connect } from "react-redux";
import Header from "../../components/Header";
import { startCase, toLower } from "lodash";
import { usePrevious } from "../../utils";
import { CONTEXT } from "./constants";

interface Props {
  fetchLoading: boolean;
  updateLoading: boolean;
  updatedConcept?: APIConcept;
  concept?: APIConcept;
  fetchErrors?: {};
  updateErrors?: {};
  retrieveConcept: Function;
  updateConcept: Function;
  allMappingErrors?: { errors: string }[];
  progress?: string;
}

const EditConceptPage: React.FC<Props> = ({
  retrieveConcept,
  concept,
  fetchLoading,
  fetchErrors,
  updatedConcept,
  updateErrors,
  updateLoading,
  updateConcept,
  allMappingErrors = [],
  progress
}) => {
  const { pathname: url } = useLocation();
  const { ownerType, owner, source } = useParams();

  const anyMappingsErrors =
    !!allMappingErrors.length && allMappingErrors.some(value => value);

  const status =
    !updateErrors && anyMappingsErrors
      ? "Concept updated. Some mappings were not updated or added. Fix the errors and retry."
      : progress;

  useEffect(() => {
    retrieveConcept(url.replace("edit/", ""));
  }, [url, retrieveConcept]);

  const updatePreviouslyLoading = usePrevious(updateLoading);

  if (fetchLoading) {
    return <span>Loading...</span>;
  }

  if (
    !updateLoading &&
    updatePreviouslyLoading &&
    !updateErrors &&
    updatedConcept &&
    !anyMappingsErrors
  ) {
    return <Redirect to={updatedConcept.url} />;
  }

  return (
    <Header
      title={
        "Edit " + startCase(toLower(concept ? concept.display_name : "concept"))
      }
    >
      <Grid id="editConceptPage" item xs={8} component="div">
        <ConceptForm
          context={CONTEXT.edit}
          status={status}
          savedValues={apiConceptToConcept(concept)}
          loading={updateLoading}
          errors={updateErrors}
          allMappingErrors={allMappingErrors}
          onSubmit={(data: BaseConcept) =>
            updateConcept(data, `/${ownerType}/${owner}/sources/${source}/`)
          }
        />
      </Grid>
    </Header>
  );
};

const mapStateToProps = (state: AppState) => ({
  concept: state.concepts.concept,
  updatedConcept: state.concepts.upsertedConcept,
  updateLoading: upsertConceptAndMappingsLoadingSelector(state),
  fetchLoading: viewConceptLoadingSelector(state),
  fetchErrors: viewConceptErrorsSelector(state),
  updateErrors: upsertConceptErrorsSelector(state),
  allMappingErrors: upsertAllMappingsErrorSelector(state),
  progress: upsertConceptAndMappingsProgressSelector(state)
});

const mapActionsToProps = {
  retrieveConcept: retrieveConceptAction,
  updateConcept: upsertConceptAndMappingsAction
};

export default connect(mapStateToProps, mapActionsToProps)(EditConceptPage);
