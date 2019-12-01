import React, { useEffect } from 'react'
import { DictionaryDetails, DictionaryForm } from './components'
import { Fab, Grid, Paper, Typography } from '@material-ui/core'
import { Edit as EditIcon } from '@material-ui/icons'
import './ViewDictionaryPage.scss'
import { connect } from 'react-redux'
import { APIDictionary, apiDictionaryToDictionary } from './types'
import { orgsSelector, profileSelector } from '../authentication/redux/reducer'
import { APIOrg, APIProfile } from '../authentication'
import {
  retrieveDictionaryAndDetailsAction,
  retrieveDictionaryDetailsLoadingSelector,
  retrieveDictionaryLoadingSelector
} from './redux'
import { AppState } from '../../redux'
import { Link, useLocation, useParams } from 'react-router-dom'
import { APISource } from '../sources'
import { APICollection } from '../collections'
import { canModifyContainer } from '../authentication'

interface Props {
  profile?: APIProfile,
  usersOrgs?: APIOrg[],
  dictionaryLoading: boolean,
  dictionaryDetailsLoading: boolean,
  dictionary?: APIDictionary,
  retrieveDictionaryAndDetails: Function,
  source?: APISource,
  collection?: APICollection,
}

const ViewDictionaryPage: React.FC<Props> = ({ profile, usersOrgs=[], dictionaryLoading, dictionaryDetailsLoading, dictionary, retrieveDictionaryAndDetails, source, collection }: Props) => {
  const { pathname: url } = useLocation();
  const {ownerType, owner} = useParams<{ownerType: string, owner: string}>();

  useEffect(() => {
    retrieveDictionaryAndDetails(url.replace('/dictionaries/', '/collections/'))
  }, [url, retrieveDictionaryAndDetails]);

  const canEditDictionary = canModifyContainer(ownerType, owner, profile, usersOrgs);

  if (dictionaryLoading) return <span>'Loading...'</span>

  return (
    <>
      <Grid id="viewDictionaryPage" item xs={5} component="div">
        <Paper className="fieldsetParent">
          <fieldset>
            <Typography component="legend" variant="h5" gutterBottom>General Details</Typography>
            <DictionaryForm
              savedValues={apiDictionaryToDictionary(dictionary)}
              profile={profile}
              usersOrgs={usersOrgs}
              loading={true}
            />
          </fieldset>
        </Paper>
      </Grid>
      <Grid item xs={5} component="div">
        {dictionaryDetailsLoading ? 'Loading...' : (
          <DictionaryDetails source={source} collection={collection}/>
        )}
      </Grid>
      {!canEditDictionary ? null : (
        <Link to={`${url}edit/`} color="primary" className="fab" component={Fab}>
          <EditIcon/>
        </Link>
      )}
    </>
  )
}

const mapStateToProps = (state: AppState) => ({
  profile: profileSelector(state),
  usersOrgs: orgsSelector(state),
  dictionaryLoading: retrieveDictionaryLoadingSelector(state),
  dictionary: state.dictionaries.dictionary,
  dictionaryDetailsLoading: retrieveDictionaryDetailsLoadingSelector(state),
  source: state.sources.source,
  collection: state.collections.collection,
})
const mapDispatchToProps = {
  retrieveDictionaryAndDetails: retrieveDictionaryAndDetailsAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewDictionaryPage)
