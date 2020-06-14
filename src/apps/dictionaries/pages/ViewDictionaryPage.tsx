import React, { useEffect } from "react";
import {
  DictionaryDetails,
  DictionaryForm,
  ReleasedVersions
} from "../components";
import { Fab, Grid, Paper, Tooltip, Typography } from "@material-ui/core";
import { EditOutlined as EditIcon } from "@material-ui/icons";
import { connect } from "react-redux";
import {
  APIDictionary,
  apiDictionaryToDictionary,
  APIDictionaryVersion,
  DictionaryVersion
} from "../types";
import {
  orgsSelector,
  profileSelector
} from "../../authentication/redux/reducer";
import { APIOrg, APIProfile, canModifyContainer } from "../../authentication";
import {
  createDictionaryVersionAction,
  createDictionaryVersionErrorSelector,
  createDictionaryVersionLoadingSelector,
  dictionarySelector,
  retrieveDictionaryAndDetailsAction,
  retrieveDictionaryErrorSelector,
  retrieveDictionaryLoadingSelector,
  retrieveDictionaryVersionLoadingSelector
} from "../redux";
import { AppState } from "../../../redux";
import { Link, useLocation, useParams } from "react-router-dom";
import { CONTEXT } from "../constants";
import { ProgressOverlay } from "../../../utils/components";

interface Props {
  profile?: APIProfile;
  usersOrgs?: APIOrg[];
  dictionaryLoading: boolean;
  dictionary?: APIDictionary;
  retrieveDictionaryAndDetails: (
    ...args: Parameters<typeof retrieveDictionaryAndDetailsAction>
  ) => void;
  createDictionaryVersion: (
    ...args: Parameters<typeof createDictionaryVersionAction>
  ) => void;
  versions: APIDictionaryVersion[];
  versionsLoading: boolean;
  createVersionLoading: boolean;
  createVersionError?: { detail: string };
  retrieveDictionaryErrors?: {};
}

const ViewDictionaryPage: React.FC<Props> = ({
  profile,
  usersOrgs = [],
  dictionaryLoading,
  dictionary,
  retrieveDictionaryAndDetails,
  versions,
  versionsLoading,
  createDictionaryVersion,
  createVersionLoading,
  createVersionError,
  retrieveDictionaryErrors
}: Props) => {
  const { pathname: url } = useLocation();
  const { ownerType, owner } = useParams<{
    ownerType: string;
    owner: string;
  }>();

  useEffect(() => {
    retrieveDictionaryAndDetails(url);
  }, [url, retrieveDictionaryAndDetails]);

  const canEditDictionary = canModifyContainer(
    ownerType,
    owner,
    profile,
    usersOrgs
  );
  const showEditButton = canEditDictionary; // redundant, yes, but we don't want to couple them

  return (
    <ProgressOverlay
      delayRender
      loading={dictionaryLoading}
      error={
        retrieveDictionaryErrors
          ? "Could not load dictionary. Refresh the page to retry"
          : undefined
      }
    >
      <Grid id="viewDictionaryPage" item xs={5} component="div">
        <Paper className="fieldsetParent">
          <fieldset>
            <Typography component="legend" variant="h5" gutterBottom>
              General Details
            </Typography>
            <DictionaryForm
              context={CONTEXT.view}
              savedValues={apiDictionaryToDictionary(dictionary)}
              profile={profile}
              usersOrgs={usersOrgs}
              loading={true}
            />
          </fieldset>
        </Paper>
      </Grid>
      <Grid item xs={5} container spacing={2}>
        <Grid item xs={12} component="div">
          {dictionary ? (
            <DictionaryDetails dictionary={dictionary} />
          ) : (
            <span>Couldn't find dictionary details</span>
          )}
        </Grid>
        <Grid item xs={12} component="div">
          {versionsLoading ? (
            "Loading versions..."
          ) : (
            <ReleasedVersions
              versions={versions}
              subscriptionUrl={url}
              showCreateVersionButton={canEditDictionary}
              createDictionaryVersion={(data: DictionaryVersion) =>
                createDictionaryVersion(url, data)
              }
              createVersionLoading={createVersionLoading}
              createVersionError={createVersionError}
              dictionaryUrl={url}
            />
          )}
        </Grid>
      </Grid>
      {!showEditButton ? null : (
        <Link to={`${url}edit/`}>
          <Tooltip title="Edit this dictionary">
            <Fab color="primary" className="fab">
              <EditIcon />
            </Fab>
          </Tooltip>
        </Link>
      )}
    </ProgressOverlay>
  );
};

const mapStateToProps = (state: AppState) => ({
  profile: profileSelector(state),
  usersOrgs: orgsSelector(state),
  dictionaryLoading: retrieveDictionaryLoadingSelector(state),
  dictionary: dictionarySelector(state),
  versions: state.dictionaries.versions,
  versionsLoading: retrieveDictionaryVersionLoadingSelector(state),
  createVersionLoading: createDictionaryVersionLoadingSelector(state),
  createVersionError: createDictionaryVersionErrorSelector(state),
  retrieveDictionaryErrors: retrieveDictionaryErrorSelector(state)
});
const mapDispatchToProps = {
  retrieveDictionaryAndDetails: retrieveDictionaryAndDetailsAction,
  createDictionaryVersion: createDictionaryVersionAction
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewDictionaryPage);
