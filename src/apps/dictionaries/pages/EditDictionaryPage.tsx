import React, {useEffect} from "react";
import {DictionaryForm} from "../components";
import {Grid, MenuItem, Paper} from "@material-ui/core";
import {connect} from "react-redux";
import {Link, Redirect, useLocation} from "react-router-dom";
import {
  createAndAddLinkedSourceAction,
  createAndAddLinkedSourceLoadingSelector,
  createAndAddLinkedSourceProgressSelector,
  editDictionaryLoadingSelector,
  editDictionaryProgressSelector,
  editSourceAndDictionaryAction,
  editSourceAndDictionaryErrorsSelector,
  makeRetrieveDictionaryAction,
  resetEditDictionaryAction,
  retrieveDictionaryLoadingSelector
} from "../redux";
import {APIDictionary, apiDictionaryToDictionary, Dictionary} from "../types";
import {orgsSelector, profileSelector} from "../../authentication/redux/reducer";
import {APIOrg, APIProfile} from "../../authentication";
import {CONTEXT, debug, usePrevious, useQueryParams} from "../../../utils"
import {ProgressOverlay} from "../../../utils/components";
import Header from "../../../components/Header";
import {EditMenu} from "../../containers/components/EditMenu";
import { AppState } from "../../../redux";

interface StateProps {
  errors?: {};
  profile?: APIProfile;
  usersOrgs?: APIOrg[];
  createAndAddLinkedSourceLoading: boolean;
  loading: boolean;
  editedDictionary?: APIDictionary;
  dictionaryLoading: boolean;
  dictionary?: APIDictionary;
}

interface ActionProps {
  editSourceAndDictionary: (
    ...args: Parameters<typeof editSourceAndDictionaryAction>
  ) => void;
  retrieveDictionary: (
    ...args: Parameters<ReturnType<typeof makeRetrieveDictionaryAction>>
  ) => void;
  createAndAddLinkedSource: (
    ...args: Parameters<typeof createAndAddLinkedSourceAction>
  ) => void;
  resetEditDictionary: () => void;
}

type Props = StateProps & ActionProps;

interface URLQueryParams {
  next?: string;
  createLinkedSource?: string;
}

const EditDictionaryPage: React.FC<Props> = ({
  profile,
  usersOrgs,
  errors,
  editSourceAndDictionary,
  createAndAddLinkedSource,
  createAndAddLinkedSourceLoading,
  loading,
  dictionaryLoading,
  dictionary,
  editedDictionary,
  resetEditDictionary,
  retrieveDictionary
}: Props) => {
  const { pathname: url } = useLocation();
  const dictionaryUrl = url.replace("edit/", "");
  const { next: nextUrl } = useQueryParams<URLQueryParams>();
  const createLinkedSource =
    useQueryParams<URLQueryParams>().createLinkedSource === "true";
  const linkedSource = dictionary?.extras?.source;

  const previouslyLoading = usePrevious(loading);

  useEffect(() => {
    retrieveDictionary(dictionaryUrl);
  }, [dictionaryUrl, retrieveDictionary]);

  useEffect(() => {
    const dictionaryData = apiDictionaryToDictionary(dictionary);
    if (
      !loading &&
      createLinkedSource &&
      dictionary &&
      dictionaryData &&
      !linkedSource
    ) {
      createAndAddLinkedSource(dictionary.url, dictionaryData);
    }
  }, [
    loading,
    createLinkedSource,
    dictionary,
    linkedSource,
    createAndAddLinkedSource
  ]);
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => resetEditDictionary, []);

  if (!loading && previouslyLoading && editedDictionary) {
    return <Redirect to={nextUrl || editedDictionary.url} />;
  }

  return (
    <Header
      title="Edit Dictionary"
      backUrl={dictionaryUrl}
      backText="Back to dictionary"
    >
      <ProgressOverlay
        loadingMessage={
          createAndAddLinkedSourceLoading ? "Creating linked source" : undefined
        }
        delayRender={dictionaryLoading}
        loading={dictionaryLoading || createAndAddLinkedSourceLoading}
      >
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
                  editSourceAndDictionary(dictionary.url, values, linkedSource);
                else
                  debug("Could not edit dictionary. dictionary is undefined");
              }}
            />
          </Paper>
        </Grid>
        <EditMenu backUrl={dictionaryUrl}/>
        {createLinkedSource || linkedSource ? (
            <span/>
        ) : (
            <MenuItem>
              <Link
                  replace
                  className="link"
                  to={`${url}?createLinkedSource=true`}
              >
                Create linked source
              </Link>
            </MenuItem>
        )}
      </ProgressOverlay>
    </Header>
  );
};

const mapStateToProps = (state: AppState) => ({
  profile: profileSelector(state),
  usersOrgs: orgsSelector(state),
  createAndAddLinkedSourceLoading: createAndAddLinkedSourceLoadingSelector(
    state
  ),
  loading:
    editDictionaryLoadingSelector(state) ||
    createAndAddLinkedSourceLoadingSelector(state),
  progress:
    createAndAddLinkedSourceProgressSelector(state) ||
    editDictionaryProgressSelector(state),
  editedDictionary: state.dictionaries.editedDictionary,
  errors: editSourceAndDictionaryErrorsSelector(state),
  dictionaryLoading: retrieveDictionaryLoadingSelector(state),
  dictionary: state.dictionaries.dictionary
});

const mapActionsToProps = {
  editSourceAndDictionary: editSourceAndDictionaryAction,
  resetEditDictionary: resetEditDictionaryAction,
  retrieveDictionary: makeRetrieveDictionaryAction(false),
  createAndAddLinkedSource: createAndAddLinkedSourceAction
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(EditDictionaryPage);
