import React, { useEffect } from "react";
import { DictionaryForm } from "../components";
import { Fab, Grid, Menu, MenuItem, Paper, Tooltip } from "@material-ui/core";
import { connect } from "react-redux";
import { Link, Redirect, useLocation } from "react-router-dom";
import {
  createAndAddLinkedSourceAction,
  createAndAddLinkedSourceLoadingSelector,
  createAndAddLinkedSourceProgressSelector,
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
import { debug, useAnchor, usePrevious, useQueryParams } from "../../../utils";
import { CONTEXT } from "../constants";
import { ProgressOverlay } from "../../../utils/components";
import {
  editSourceAndDictionaryAction,
  makeRetrieveDictionaryAction
} from "../redux";
import { MoreVert as MenuIcon } from "@material-ui/icons";
import Header from "../../../components/Header";

interface StateProps {
  errors?: {};
  profile?: APIProfile;
  usersOrgs?: APIOrg[];
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
  loading,
  dictionaryLoading,
  dictionary,
  editedDictionary,
  retrieveDictionary
}: Props) => {
  const { pathname: url } = useLocation();
  const dictionaryUrl = url.replace("edit/", "");
  const { next: nextUrl = editedDictionary?.url } = useQueryParams<
    URLQueryParams
  >();
  const createLinkedSource =
    useQueryParams<URLQueryParams>().createLinkedSource === "true";
  const linkedSource = dictionary?.extras?.source;

  const previouslyLoading = usePrevious(loading);

  useEffect(() => {
    retrieveDictionary(dictionaryUrl);
  }, [dictionaryUrl, retrieveDictionary]);

  useEffect(() => {
    const dictionaryToUpdate = apiDictionaryToDictionary(dictionary);
    if (
      !loading &&
      createLinkedSource &&
      dictionary &&
      dictionaryToUpdate &&
      !linkedSource
    ) {
      createAndAddLinkedSource(dictionary.url, dictionaryToUpdate);
    }
  }, [
    loading,
    createLinkedSource,
    dictionary,
    linkedSource,
    createAndAddLinkedSource
  ]);

  const [menuAnchor, handleMenuClick, handleMenuClose] = useAnchor();

  if (!loading && previouslyLoading && editedDictionary) {
    return <Redirect to={nextUrl || editedDictionary.url} />;
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
                  editSourceAndDictionary(dictionary.url, values, linkedSource);
                else
                  debug("Could not edit dictionary. dictionary is undefined");
              }}
            />
          </Paper>
        </Grid>
        <>
          <Tooltip title="Menu">
            <Fab onClick={handleMenuClick} color="primary" className="fab">
              <MenuIcon />
            </Fab>
          </Tooltip>
          <Menu
            anchorEl={menuAnchor}
            keepMounted
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
          >
            <MenuItem>
              <Link replace className="link" to={dictionaryUrl}>
                Discard changes and view
              </Link>
            </MenuItem>
            {createLinkedSource || linkedSource ? (
              <span />
            ) : (
              <MenuItem>
                <Link
                  replace
                  className="link"
                  to={`${url}?createLinkedSource=true&next=${nextUrl ||
                    dictionaryUrl}`}
                >
                  Create linked source
                </Link>
              </MenuItem>
            )}
          </Menu>
        </>
      </ProgressOverlay>
    </Header>
  );
};

const mapStateToProps = (state: any) => ({
  profile: profileSelector(state),
  usersOrgs: orgsSelector(state),
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
  retrieveDictionary: makeRetrieveDictionaryAction(false),
  createAndAddLinkedSource: createAndAddLinkedSourceAction
};

export default connect<StateProps, ActionProps, unknown>(
  mapStateToProps,
  mapActionsToProps
)(EditDictionaryPage);
