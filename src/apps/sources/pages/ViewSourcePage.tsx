import React, { useEffect } from "react";
import SourceForm from "../components/SourceForm";
import { Grid, Paper, Typography } from "@material-ui/core";
import { connect } from "react-redux";

import {
  APISource,
  apiSourceToSource,
  APISourceVersion,
  SourceVersion,
} from "../types";

import {
  orgsSelector,
  profileSelector,
} from "../../authentication/redux/reducer";
import { APIOrg, APIProfile, canModifyContainer } from "../../authentication";
import {
  retrieveSourceAndDetailsAction,
  retrieveSourceErrorSelector,
  retrieveSourceLoadingSelector,
  sourceSelector,
  createSourceVersionAction,
  editSourceVersionAction,
  retrieveSourceVersionsAction,
  retrieveSourceVersionLoadingSelector,
  createSourceVersionLoadingSelector,
  createSourceVersionErrorSelector,
} from "../redux";
import { AppState } from "../../../redux";
import { useLocation, useParams } from "react-router-dom";
import { ProgressOverlay } from "../../../utils/components";
import Header from "../../../components/Header";
import { EditButton } from "../../containers/components/EditButton";
import { EDIT_BUTTON_TITLE } from "../redux/constants";
import { getSourceTypeFromPreviousPath } from "../utils";
import { SourceConceptDetails } from "../components";
import {
  retrieveActiveConceptsAction,
  retrieveConceptsAction,
  viewConceptsLoadingSelector,
  viewConceptsErrorsSelector,
  viewActiveConceptsLoadingSelector,
  viewActiveConceptsErrorsSelector,
} from "../../concepts/redux";

import ContainerReleasedVersions from "../../containers/components/ContainerReleasedVersions";

interface Props {
  profile?: APIProfile;
  usersOrgs?: APIOrg[];
  sourceLoading: boolean;
  source?: APISource;
  retrieveSourceAndDetails: (
    ...args: Parameters<typeof retrieveSourceAndDetailsAction>
  ) => void;
  retrieveSourceErrors?: {};
  retrieveConceptsSummary: (
    ...args: Parameters<typeof retrieveConceptsAction>
  ) => void;
  retrieveActiveConceptsSummary: (
    ...args: Parameters<typeof retrieveActiveConceptsAction>
  ) => void;
  metaActiveConceptsCount?: { num_found?: number };
  createSourceVersion: (
    ...args: Parameters<typeof createSourceVersionAction>
  ) => void;
  editSourceVersion: (
    ...args: Parameters<typeof editSourceVersionAction>
  ) => void;
  retrieveSourceVersions: (
    ...args: Parameters<typeof retrieveSourceVersionsAction>
  ) => void;
  metaConceptsCount?: { num_found?: number };
  versions: APISourceVersion[];
  versionsLoading: boolean;
  createVersionLoading: boolean;
  createVersionError?: { detail: string };
}
interface UseLocation {
  prevPath: string;
}
export const ViewSourcePage: React.FC<Props> = ({
  profile,
  usersOrgs = [],
  sourceLoading,
  source,
  versions,
  versionsLoading,
  retrieveSourceAndDetails,
  retrieveSourceErrors,
  retrieveConceptsSummary,
  retrieveActiveConceptsSummary,
  metaConceptsCount = {},
  metaActiveConceptsCount = {},
  createVersionError,
  createVersionLoading,
  retrieveSourceVersions,
  createSourceVersion,
  editSourceVersion,
}: Props) => {
  const { pathname: url, state } = useLocation<UseLocation>();
  const previousPath = state ? state.prevPath : "";
  const { ownerType, owner } = useParams<{
    ownerType: string;
    owner: string;
  }>();

  useEffect(() => {
    retrieveSourceAndDetails(url);
  }, [url, retrieveSourceAndDetails]);
  useEffect(() => {
    retrieveConceptsSummary({
      conceptsUrl: `${url}concepts/`,
      limit: 1,
      includeRetired: true,
    });
  }, [url, retrieveConceptsSummary]);
  useEffect(() => {
    retrieveActiveConceptsSummary({ conceptsUrl: `${url}concepts/`, limit: 1 });
  }, [url, retrieveActiveConceptsSummary]);

  const canEditSource = canModifyContainer(
    ownerType,
    owner,
    profile,
    usersOrgs
  );
  const showEditButton = canEditSource;

  return (
    <Header
      title={`${getSourceTypeFromPreviousPath(previousPath)} > ${source?.name ||
        ""}`}
      justifyChildren="space-around"
      backUrl="/user/sources/"
      backText="Back to sources"
    >
      <ProgressOverlay
        delayRender
        loading={sourceLoading}
        error={
          retrieveSourceErrors
            ? "Could not load source. Refresh the page to retry"
            : undefined
        }
      >
        <Grid id="viewSourcePage" item xs={5} component="div">
          <Paper className="fieldsetParent">
            <fieldset style={{ minWidth: "0" }}>
              <Typography component="legend" variant="h5" gutterBottom>
                General Details
              </Typography>
              <SourceForm
                savedValues={apiSourceToSource(source)}
                profile={profile}
                usersOrgs={usersOrgs}
                loading={true}
              />
            </fieldset>
          </Paper>
        </Grid>
        <Grid item xs={5} container spacing={2}>
          <Grid item xs={12} component="div">
            <SourceConceptDetails
              source={source}
              totalConceptCount={metaConceptsCount.num_found || 0}
              activeConceptCount={metaActiveConceptsCount.num_found || 0}
            />
          </Grid>
          <Grid item xs={12} component="div">
            {versionsLoading ? (
              "Loading versions..."
            ) : (
              <ContainerReleasedVersions
                versions={versions}
                showCreateVersionButton={canEditSource}
                createVersion={async (data: SourceVersion) => {
                  const response: any = await createSourceVersion(url, data);
                  if (response) {
                    retrieveSourceVersions(url);
                  }
                }}
                createVersionLoading={createVersionLoading}
                createVersionError={createVersionError}
                url={url}
                editVersion={async (data: SourceVersion) => {
                  const response: any = await editSourceVersion(url, data);
                  if (response) {
                    retrieveSourceVersions(url);
                  }
                }}
                type={"Source"}
              />
            )}
          </Grid>
        </Grid>
        {!showEditButton ? null : (
          <EditButton url={`${url}edit/`} title={EDIT_BUTTON_TITLE} />
        )}
      </ProgressOverlay>
    </Header>
  );
};

export const mapStateToProps = (state: AppState) => ({
  profile: profileSelector(state),
  usersOrgs: orgsSelector(state),
  sourceLoading:
    retrieveSourceLoadingSelector(state) ||
    viewConceptsLoadingSelector(state) ||
    viewActiveConceptsLoadingSelector(state),
  source: sourceSelector(state),
  versions: state.sources.versions,
  versionsLoading: retrieveSourceVersionLoadingSelector(state),
  createVersionLoading: createSourceVersionLoadingSelector(state),
  createVersionError: createSourceVersionErrorSelector(state),
  metaConceptsCount: state.concepts.concepts
    ? state.concepts.concepts.responseMeta
    : undefined,
  metaActiveConceptsCount: state.concepts.activeConcepts
    ? state.concepts.activeConcepts.responseMeta
    : undefined,
  retrieveSourceErrors:
    retrieveSourceErrorSelector(state) ||
    viewConceptsErrorsSelector(state) ||
    viewActiveConceptsErrorsSelector(state),
});
export const mapDispatchToProps = {
  retrieveSourceAndDetails: retrieveSourceAndDetailsAction,
  retrieveConceptsSummary: retrieveConceptsAction,
  retrieveActiveConceptsSummary: retrieveActiveConceptsAction,
  createSourceVersion: createSourceVersionAction,
  editSourceVersion: editSourceVersionAction,
  retrieveSourceVersions: retrieveSourceVersionsAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewSourcePage);
