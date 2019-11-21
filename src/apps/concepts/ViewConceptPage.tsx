import React, { useEffect } from 'react'
import {Grid} from "@material-ui/core";
import { ConceptForm } from './components'
import { AppState } from '../../redux'
import { viewConceptLoadingSelector, viewConceptErrorsSelector, retrieveConceptAction } from './redux'
import { APIConcept, apiConceptToConcept } from './types'
import { useLocation } from 'react-router'
import { connect } from 'react-redux'

interface Props {
  loading: boolean,
  concept?: APIConcept,
  errors?: {},
  retrieveConcept: Function,
}

const ViewConceptPage: React.FC<Props> = ({retrieveConcept, concept, loading, errors}) => {
  const {pathname: url} = useLocation();

  useEffect(() => {
    retrieveConcept(url);
  }, [url, retrieveConcept]);

  if (loading) {
    return <span>Loading...</span>;
  }

  return (
      <Grid item xs={8} component="div">
          <ConceptForm savedValues={apiConceptToConcept(concept)} loading={true} errors={errors} />
      </Grid>
  )
};

const mapStateToProps = (state: AppState) => ({
  concept: state.concepts.concept,
  loading: viewConceptLoadingSelector(state),
  errors: viewConceptErrorsSelector(state),
});

const mapActionsToProps = {
  retrieveConcept: retrieveConceptAction,
};

export default connect(mapStateToProps, mapActionsToProps)(ViewConceptPage);
