import React, { useEffect } from "react";
import { DictionaryForm } from "../components";
import { Grid, Paper } from "@material-ui/core";
import { connect } from "react-redux";
import { Redirect, useLocation } from "react-router-dom";
import {
  createDictionaryLoadingSelector,
  createDictionaryProgressSelector,
  copyCreateDictionaryLoadingSelector,
  createSourceAndDictionaryErrorsSelector,
  resetCreateDictionaryAction,
  copyCreateAndAddConcpetsDictionaryAction
} from "../redux";
import { APIDictionary, Dictionary } from "../types";
import {
  orgsSelector,
  profileSelector,
} from "../../authentication/redux/reducer";
import { APIOrg, APIProfile } from "../../authentication";
import { usePrevious, CONTEXT } from "../../../utils";
import { createSourceAndDictionaryAction } from "../redux/actions";
import Header from "../../../components/Header";
import { getDictionaryTypeFromPreviousPath } from "../utils";
import { AppState } from "../../../redux";
interface Props {
  errors?: {};
  profile?: APIProfile;
  usersOrgs?: APIOrg[];
  createSourceAndDictionary: (
    ...args: Parameters<typeof createSourceAndDictionaryAction>
  ) => void;
  createAndAddConceptReferences: (
    ...args: Parameters<typeof copyCreateAndAddConcpetsDictionaryAction>
  ) => void;
  loading: boolean;
  copyLoading: boolean;
  newDictionary?: APIDictionary;
  resetCreateDictionary: () => void;
}
interface UseLocation {
  prevPath: string;
}

const CreateDictionaryPage: React.FC<Props> = ({
  profile,
  usersOrgs,
  errors,
  createSourceAndDictionary,
  createAndAddConceptReferences,
  loading,
  copyLoading,
  resetCreateDictionary,
  newDictionary,
}: Props) => {
  const previouslyLoading = usePrevious(loading);
  const previouslyCopyLoading = usePrevious(copyLoading);
  const { state } = useLocation<UseLocation>();
  const previousPath = state ? state.prevPath : "";

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => resetCreateDictionary, []);

  if (!copyLoading && previouslyCopyLoading && newDictionary) {
    return <Redirect to={newDictionary.url} />;
  }

  if (!loading && !copyLoading && previouslyLoading && newDictionary) {
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
            usersOrgs={usersOrgs ? usersOrgs : []}
            loading={loading}
            createAndAddConcepts={createAndAddConceptReferences}
            onSubmit={(values: Dictionary) => createSourceAndDictionary(values)}
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
  copyLoading: copyCreateDictionaryLoadingSelector(state),
  progress: createDictionaryProgressSelector(state),
  newDictionary: state.dictionaries.newDictionary,
  errors: createSourceAndDictionaryErrorsSelector(state),
});
const mapActionsToProps = {
  createSourceAndDictionary: createSourceAndDictionaryAction,
  resetCreateDictionary: resetCreateDictionaryAction,
  createAndAddConceptReferences: copyCreateAndAddConcpetsDictionaryAction, //This is when one copied the dictionary
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(CreateDictionaryPage);
