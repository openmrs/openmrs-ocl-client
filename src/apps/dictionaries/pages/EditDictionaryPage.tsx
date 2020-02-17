import React, { useEffect } from 'react'
import { DictionaryForm } from '../components'
import { Grid, Paper } from '@material-ui/core'
import { connect } from 'react-redux'
import { Redirect, useLocation } from 'react-router-dom'
import {
  editDictionaryLoadingSelector,
  editDictionaryProgressSelector,
  editSourceAndDictionaryErrorsSelector,
  retrieveDictionaryLoadingSelector
} from '../redux'
import { APIDictionary, apiDictionaryToDictionary, Dictionary } from '../types'
import { orgsSelector, profileSelector } from '../../authentication/redux/reducer'
import { APIOrg, APIProfile } from '../../authentication'
import { debug, usePrevious } from '../../../utils'
import { CONTEXT } from '../constants'
import { ProgressOverlay } from '../../../utils/components'
import { editSourceAndDictionaryAction, retrieveDictionaryAction } from '../redux/actions'

interface Props {
  errors?: {};
  profile?: APIProfile;
  usersOrgs?: APIOrg[];
  editSourceAndDictionary: (...args: Parameters<typeof editSourceAndDictionaryAction>) => void;
  loading: boolean;
  editedDictionary?: APIDictionary;
  retrieveDictionary: (...args: Parameters<typeof retrieveDictionaryAction>) => void;
  dictionaryLoading: boolean;
  dictionary?: APIDictionary;
}

const EditDictionaryPage: React.FC<Props> = ({
  profile,
  usersOrgs,
  errors,
  editSourceAndDictionary,
  loading,
  dictionaryLoading,
  dictionary,
  editedDictionary,
  retrieveDictionary
}: Props) => {
  const { pathname: url } = useLocation();

  const previouslyLoading = usePrevious(loading);

  useEffect(() => {
    retrieveDictionary(url.replace("edit/", ""));
  }, [url, retrieveDictionary]);

  if (!loading && previouslyLoading && editedDictionary) {
    return <Redirect to={editedDictionary.url} />;
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
            onSubmit={(values: Dictionary) => {
                if (dictionary) editSourceAndDictionary(dictionary?.url, values, dictionary?.extras);
                else debug("Could not edit dictionary. dictionary is undefined");
              }
            }
          />
        </Paper>
      </Grid>
    </ProgressOverlay>
  );
};

const mapStateToProps = (state: any) => ({
  profile: profileSelector(state),
  usersOrgs: orgsSelector(state),
  loading: editDictionaryLoadingSelector(state),
  progress: editDictionaryProgressSelector(state),
  editedDictionary: state.dictionaries.editedDictionary,
  errors: editSourceAndDictionaryErrorsSelector(state),
  dictionaryLoading: retrieveDictionaryLoadingSelector(state),
  dictionary: state.dictionaries.dictionary
});
const mapActionsToProps = {
  editSourceAndDictionary: editSourceAndDictionaryAction,
  retrieveDictionary: retrieveDictionaryAction
};

export default connect(mapStateToProps, mapActionsToProps)(EditDictionaryPage);
