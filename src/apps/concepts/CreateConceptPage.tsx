import React from 'react';
import {Grid} from "@material-ui/core";
import { ConceptForm } from './components'
import { AppState } from '../../redux'
import { createConceptAndMappingsAction, createConceptErrorsSelector, createConceptLoadingSelector } from './redux'
import { APIConcept, BaseConcept } from './types'
import { usePrevious } from '../../utils'
import { Redirect, useLocation } from 'react-router'
import { connect } from 'react-redux'

interface Props {
  loading: boolean,
  newConcept?: APIConcept,
  errors?: {},
  createConcept: Function,
}

const CreateConceptPage: React.FC<Props> = ({createConcept, newConcept, loading, errors}) => {
  const {pathname: url} = useLocation();
  const sourceUrl = url.replace('concepts/new/', '');

  const previouslyLoading = usePrevious(loading);

  if (!loading && previouslyLoading && newConcept) {
    return <Redirect to={newConcept.url}/>;
  }

  return (
      <Grid item xs={8} component="div">
          <ConceptForm editing createConcept={(data: BaseConcept) => createConcept(sourceUrl, data)} loading={loading} errors={errors} />
      </Grid>
  )
};

const mapStateToProps = (state: AppState) => ({
  newConcept: state.concepts.newConcept,
  loading: createConceptLoadingSelector(state),
  errors: createConceptErrorsSelector(state),
});

const mapActionsToProps = {
  createConcept: createConceptAndMappingsAction,
};

export default connect(mapStateToProps, mapActionsToProps)(CreateConceptPage);
