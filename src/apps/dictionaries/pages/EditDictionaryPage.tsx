import React, { useEffect } from "react";
import { DictionaryForm } from "../components";
import { Fab, Grid, Paper, Tooltip } from "@material-ui/core";
import { connect } from "react-redux";
import { Link, Redirect, useLocation } from "react-router-dom";
import {
  editDictionaryLoadingSelector,
  editDictionaryProgressSelector,
  editSourceAndDictionaryErrorsSelector,
  retrieveDictionaryLoadingSelector
} from "../redux";
import { APIDictionary, apiDictionaryToDictionary, Dictionary } from "../types";
import {
  orgsSelector,
  profileSelector
} from "../../authentication/redux/reducer";
import { APIOrg, APIProfile } from "../../authentication";
import { debug, usePrevious } from "../../../utils";
import { CONTEXT } from "../constants";
import { ProgressOverlay } from "../../../utils/components";
import {
  editSourceAndDictionaryAction,
  retrieveDictionaryAction
} from "../redux/actions";
import { Pageview as PageViewIcon } from "@material-ui/icons";
import Header from "../../../components/Header";

interface Props {
  errors?: {};
  profile?: APIProfile;
  usersOrgs?: APIOrg[];
  editSourceAndDictionary: (
    ...args: Parameters<typeof editSourceAndDictionaryAction>
  ) => void;
  loading: boolean;
  editedDictionary?: APIDictionary;
  retrieveDictionary: (
    ...args: Parameters<typeof retrieveDictionaryAction>
  ) => void;
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
  const dictionaryUrl = url.replace("edit/", "");

  const previouslyLoading = usePrevious(loading);

  useEffect(() => {
    retrieveDictionary(dictionaryUrl);
  }, [dictionaryUrl, retrieveDictionary]);

  if (!loading && previouslyLoading && editedDictionary) {
    return <Redirect to={editedDictionary.url} />;
  }

  return (
    <Header
      title="Edit Dictionary"
      backUrl={dictionaryUrl}
      backText="Back to dictionary"
    >
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
                if (dictionary)
                  editSourceAndDictionary(
                    dictionary?.url,
                    values,
                    dictionary?.extras
                  );
                else
                  debug("Could not edit dictionary. dictionary is undefined");
              }}
            />
          </Paper>
        </Grid>
        <Link to={dictionaryUrl}>
          <Tooltip title="Discard changes and view">
            <Fab color="primary" className="fab">
              <PageViewIcon />
            </Fab>
          </Tooltip>
        </Link>
      </ProgressOverlay>
    </Header>
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
