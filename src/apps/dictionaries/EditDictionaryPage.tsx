import React, { useEffect } from 'react'
import { DictionaryForm } from './components'
import { Grid, Paper } from '@material-ui/core'
import { connect } from 'react-redux'
import { Redirect, useLocation } from 'react-router-dom'
import {
  editSourceCollectionDictionaryErrorsSelector,
  editDictionaryProgressSelector,
  editDictionaryLoadingSelector,
  editSourceCollectionDictionaryAction,
  retrieveDictionaryAction,
  retrieveDictionaryLoadingSelector,
} from './redux'
import { APIDictionary, apiDictionaryToDictionary, Dictionary } from './types'
import { orgsSelector, profileSelector } from '../authentication/redux/reducer'
import { APIOrg, APIProfile } from '../authentication'
import { usePrevious } from '../../utils'
import { CONTEXT } from './constants'
import { ProgressOverlay } from '../../utils/components'

interface Props {
  errors?: {},
  profile?: APIProfile,
  usersOrgs?: APIOrg[],
  editSourceCollectionDictionary: Function,
  loading: boolean,
  editedDictionary?: APIDictionary,
  retrieveDictionary: Function,
  dictionaryLoading: boolean,
  dictionary?: APIDictionary,
}

const EditDictionaryPage: React.FC<Props> = ({ profile, usersOrgs, errors, editSourceCollectionDictionary, loading, dictionaryLoading, dictionary, editedDictionary, retrieveDictionary }: Props) => {
  const { pathname: url } = useLocation()

  const previouslyLoading = usePrevious(loading)

  useEffect(() => {
    retrieveDictionary(url.replace('edit/', '').replace('/dictionaries/', '/collections/'))
  }, [url, retrieveDictionary])

  if (!loading && previouslyLoading && editedDictionary) {
    return <Redirect to={editedDictionary.url.replace('/collections/', '/dictionaries/')}/>
  }

  return (
    <ProgressOverlay delayRender loading={dictionaryLoading}>
      <Grid id="edit-dictionary-page" item xs={6} component="div">
        <Paper>
          <DictionaryForm
            context={CONTEXT.edit}
            errors={errors}
            profile={profile}
            usersOrgs={usersOrgs ? usersOrgs : []}
            loading={loading}
            savedValues={apiDictionaryToDictionary(dictionary)}
            onSubmit={(values: Dictionary) => editSourceCollectionDictionary(dictionary?.url, values, dictionary?.extras)}
          />
        </Paper>
      </Grid>
    </ProgressOverlay>
  )
}

const mapStateToProps = (state: any) => ({
  profile: profileSelector(state),
  usersOrgs: orgsSelector(state),
  loading: editDictionaryLoadingSelector(state),
  progress: editDictionaryProgressSelector(state),
  editedDictionary: state.dictionaries.editedDictionary,
  errors: editSourceCollectionDictionaryErrorsSelector(state),
  dictionaryLoading: retrieveDictionaryLoadingSelector(state),
  dictionary: state.dictionaries.dictionary,
})
const mapActionsToProps = {
  editSourceCollectionDictionary: editSourceCollectionDictionaryAction,
  retrieveDictionary: retrieveDictionaryAction,
}

export default connect(mapStateToProps, mapActionsToProps)(EditDictionaryPage)
