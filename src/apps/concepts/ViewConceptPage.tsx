import React, { useEffect } from 'react'
import { Fab, Grid } from '@material-ui/core'
import { ConceptForm } from './components'
import { AppState } from '../../redux'
import { viewConceptLoadingSelector, viewConceptErrorsSelector, retrieveConceptAction } from './redux'
import { APIConcept, apiConceptToConcept } from './types'
import { useLocation, useParams } from 'react-router'
import { connect } from 'react-redux'
import './ViewConceptPage.scss'
import { Edit as EditIcon } from '@material-ui/icons'
import { Link } from 'react-router-dom'
import Header from '../../components/Header'
import { startCase, toLower } from 'lodash'
import { APIOrg, APIProfile, canModifyContainer, profileSelector } from '../authentication'
import { orgsSelector } from '../authentication/redux/reducer'

interface Props {
  loading: boolean,
  concept?: APIConcept,
  errors?: {},
  retrieveConcept: Function,
  profile?: APIProfile,
  usersOrgs?: APIOrg[],
}

const ViewConceptPage: React.FC<Props> = ({ retrieveConcept, concept, loading, errors, profile, usersOrgs }) => {
  const { pathname: url } = useLocation()
  const {ownerType, owner}  = useParams<{ownerType: string, owner: string}>();

  const canModifySource = canModifyContainer(ownerType, owner, profile, usersOrgs);

  useEffect(() => {
    retrieveConcept(url)
  }, [url, retrieveConcept])

  if (loading) {
    return <span>Loading...</span>
  }

  return (
    <Header title={startCase(toLower(concept ? concept.display_name : 'View concept'))}>
      <Grid id="viewConceptPage" item xs={8} component="div">
        <ConceptForm savedValues={apiConceptToConcept(concept)} errors={errors}/>
      </Grid>
      {!canModifySource ? null : (
        <Link to={`${url}edit/`}>
          <Fab color="primary" className="fab">
            <EditIcon/>
          </Fab>
        </Link>
      )}
    </Header>
  )
}

const mapStateToProps = (state: AppState) => ({
  profile: profileSelector(state),
  usersOrgs: orgsSelector(state),
  concept: state.concepts.concept,
  loading: viewConceptLoadingSelector(state),
  errors: viewConceptErrorsSelector(state),
})

const mapActionsToProps = {
  retrieveConcept: retrieveConceptAction,
}

export default connect(mapStateToProps, mapActionsToProps)(ViewConceptPage)
