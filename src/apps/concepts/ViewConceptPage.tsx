import React, { useEffect } from 'react'
import { Fab, Grid } from '@material-ui/core'
import { ConceptForm } from './components'
import { AppState } from '../../redux'
import { viewConceptLoadingSelector, viewConceptErrorsSelector, retrieveConceptAction } from './redux'
import { APIConcept, apiConceptToConcept } from './types'
import { useLocation } from 'react-router'
import { connect } from 'react-redux'
import './ViewConceptPage.scss'
import { Edit as EditIcon } from '@material-ui/icons'
import { Link } from 'react-router-dom'

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
    <>
      <Grid id="viewConceptPage" item xs={8} component="div">
          <ConceptForm savedValues={apiConceptToConcept(concept)} loading={true} errors={errors} />
      </Grid>
      <Link to={`${url}edit/`} color="primary" className="fab" component={Fab}>
        <EditIcon/>
      </Link>
    </>
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
