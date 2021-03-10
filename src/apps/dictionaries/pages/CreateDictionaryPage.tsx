import React, { useEffect, useState } from "react";
import { DictionaryForm } from "../components";
import { Grid, Paper } from "@material-ui/core";
import { connect } from "react-redux";
import { Redirect, useLocation } from "react-router-dom";
import {
  createDictionaryLoadingSelector,
  createDictionaryProgressSelector,
  createSourceAndDictionaryErrorsSelector,
  resetCreateDictionaryAction,
  retrieveDictionaryAndDetailsAction,
  dictionarySelector
} from "../redux";
import { 
  APIDictionary,
  CopyableDictionary,
  dictionaryToCopyableDictionary
} from "../types";
import {
  orgsSelector,
  profileSelector,
} from "../../authentication/redux/reducer";
import { APIOrg, APIProfile } from "../../authentication";
import { usePrevious, CONTEXT } from "../../../utils";
import { createSourceAndDictionaryAction, resetRetrieveDictionaryAndDetailsAction } from "../redux/actions";
import Header from "../../../components/Header";
import { getDictionaryTypeFromPreviousPath } from "../utils";
import { AppState } from "../../../redux";
import { useQueryParams } from "../../../utils";

interface Props {
  errors?: {};
  profile?: APIProfile;
  usersOrgs?: APIOrg[];
  createSourceAndDictionary: (
    ...args: Parameters<typeof createSourceAndDictionaryAction>
  ) => void;
  retrieveDictionaryAndDetails: (
    ...args: Parameters<typeof retrieveDictionaryAndDetailsAction>
  ) => void;
  loading: boolean;
  newDictionary?: APIDictionary;
  dictionary?: APIDictionary;
  resetCreateDictionary: (
    ...args: Parameters<typeof resetCreateDictionaryAction>
  ) => void;
  resetCopyDictionary: (
    ...args: Parameters<typeof resetRetrieveDictionaryAndDetailsAction>
  ) => void;
}
interface UseLocation {
  prevPath: string;
}

const CreateDictionaryPage: React.FC<Props> = ({
  profile,
  usersOrgs,
  errors,
  createSourceAndDictionary,
  retrieveDictionaryAndDetails,
  loading,
  resetCreateDictionary,
  resetCopyDictionary,
  newDictionary,
  dictionary
}: Props) => {
  const previouslyLoading = usePrevious(loading);
  const { state } = useLocation<UseLocation>();
  const previousPath = state ? state.prevPath : "";
  const [copiedDictionary, setCopiedDictionary] = useState<CopyableDictionary | undefined>();

  const { copyFrom } = useQueryParams<{
    copyFrom: string;
  }>();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => resetCreateDictionary, []);

  useEffect(() => {
    if (copyFrom) {
      retrieveDictionaryAndDetails(copyFrom);
    } else if (dictionary) {
      resetCopyDictionary();
    }
  }, [copyFrom, dictionary, retrieveDictionaryAndDetails, resetCopyDictionary]);

  useEffect(() => {
    if (dictionary) {
      setCopiedDictionary(dictionaryToCopyableDictionary(dictionary));
    } else {
      setCopiedDictionary(undefined);
    }
  }, [dictionary]);

  if (!loading && previouslyLoading && newDictionary) {
    return <Redirect to={newDictionary.url} />;
  }

  return (
    <Header
      title={`${getDictionaryTypeFromPreviousPath(
        previousPath
      )} > Create Dictionary`}
      backUrl="/user/collections/"
      backText="Back to dictionaries"
      justifyChildren="space-around"
    >
      <Grid id="create-dictionary-page" item xs={6} component="div">
        <Paper>
          <DictionaryForm
            context={CONTEXT.create}
            errors={errors}
            profile={profile}
            usersOrgs={usersOrgs ?? []}
            loading={loading}
            onSubmit={createSourceAndDictionary}
            copiedDictionary={copiedDictionary}
          />
        </Paper>
      </Grid>
    </Header>
  );
};

const mapStateToProps = (state: AppState) => ({
  profile: profileSelector(state),
  usersOrgs: orgsSelector(state),
  loading: createDictionaryLoadingSelector(state),
  progress: createDictionaryProgressSelector(state),
  newDictionary: state.dictionaries.newDictionary,
  dictionary: dictionarySelector(state),
  errors: createSourceAndDictionaryErrorsSelector(state),
});
const mapActionsToProps = {
  createSourceAndDictionary: createSourceAndDictionaryAction,
  retrieveDictionaryAndDetails: retrieveDictionaryAndDetailsAction,
  resetCreateDictionary: resetCreateDictionaryAction,
  resetCopyDictionary: resetRetrieveDictionaryAndDetailsAction
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(CreateDictionaryPage);
