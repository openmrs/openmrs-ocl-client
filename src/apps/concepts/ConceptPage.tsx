import React, { useEffect } from "react";
import { Fab, Grid, Tooltip } from '@material-ui/core'
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
import { APIConcept, apiConceptToConcept, APIMapping, BaseConcept } from './types'
import { Redirect, useLocation, useParams } from "react-router";
import { connect } from "react-redux";
import Header from "../../components/Header";
import { startCase, toLower } from "lodash";
import { usePrevious, useQuery } from '../../utils'
import { CONTEXT } from "./constants";
import { Pageview as PageViewIcon } from '@material-ui/icons'
import { Link } from 'react-router-dom'

interface Props {
  fetchLoading: boolean;
  loading: boolean;
  concept?: APIConcept;
  mappings: APIMapping[];
  fetchErrors?: {};
  errors?: {};
  retrieveConcept: Function;
  upsertConcept: Function;
  allMappingErrors?: { errors: string }[];
  progress?: string;
}

const ConceptPage: React.FC<Props> = ({
  retrieveConcept,
  concept,
  mappings,
  fetchLoading,
  fetchErrors,
  errors,
  loading,
  upsertConcept,
  allMappingErrors = [],
  progress
}) => {
  const { pathname: url } = useLocation();
  const { ownerType, owner, source, concept: conceptId } = useParams();
  const { conceptClass, linkedDictionary } = useQuery();
  const sourceUrl = `/${ownerType}/${owner}/sources/${source}/`;

  const previouslyLoading = usePrevious(loading);
  let context = conceptId ? CONTEXT.edit : CONTEXT.create;

  const anyMappingsErrors =
    !!allMappingErrors.length && allMappingErrors.some(value => value);

  const status =
    !errors && anyMappingsErrors
      ? "Concept updated. Some mappings were not updated or added. Fix the errors and retry."
      : progress;

  useEffect(() => {
    if (conceptId) retrieveConcept(`${sourceUrl}concepts/${conceptId}/`);
  }, [url, retrieveConcept]);

  if (fetchLoading) {
    return <span>Loading...</span>;
  }

  if (!loading && previouslyLoading && concept) {
    if (!errors && !anyMappingsErrors) return <Redirect to={`${concept.url}${linkedDictionary ? `?linkedDictionary=${linkedDictionary}` : ''}`} />;
    else context = CONTEXT.edit;
  }

  return (
    <Header
      title={
        context === CONTEXT.edit ?
          "Edit " + startCase(toLower(concept ? concept.display_name : "concept")):
          "Create concept"
      }
    >
      <Grid id="editConceptPage" item xs={8} component="div">
        <ConceptForm
          conceptClass={conceptClass}
          context={context}
          status={status}
          savedValues={context === CONTEXT.edit ? apiConceptToConcept(concept, mappings) : undefined}
          loading={loading}
          errors={errors}
          allMappingErrors={allMappingErrors}
          supportLegacyMappings={!!conceptId}
          onSubmit={(data: BaseConcept) =>
            upsertConcept(data, sourceUrl, linkedDictionary)
          }
        />
      </Grid>

    </Header>
  );
};

const mapStateToProps = (state: AppState) => ({
  concept: state.concepts.concept,
  mappings: state.concepts.mappings,
  loading: upsertConceptAndMappingsLoadingSelector(state),
  fetchLoading: viewConceptLoadingSelector(state),
  fetchErrors: viewConceptErrorsSelector(state),
  errors: upsertConceptErrorsSelector(state),
  allMappingErrors: upsertAllMappingsErrorSelector(state),
  progress: upsertConceptAndMappingsProgressSelector(state)
});

const mapActionsToProps = {
  retrieveConcept: retrieveConceptAction,
  upsertConcept: upsertConceptAndMappingsAction
};

export default connect(mapStateToProps, mapActionsToProps)(ConceptPage);
