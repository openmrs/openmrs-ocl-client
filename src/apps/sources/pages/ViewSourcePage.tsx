import React, { useEffect } from "react";
import SourceForm from "../components/SourceForm";
import { Grid, Paper, Typography } from "@material-ui/core";
import { connect } from "react-redux";
import { APISource, apiSourceToSource } from "../types";
import {
  orgsSelector,
  profileSelector,
} from "../../authentication/redux/reducer";
import { APIOrg, APIProfile } from "../../authentication";
import {
  sourceSelector,
  retrieveSourceAndDetailsAction,
  retrieveSourceErrorSelector,
  retrieveSourceLoadingSelector,
} from "../redux";
import { AppState } from "../../../redux";
import { useLocation } from "react-router-dom";
import { ProgressOverlay } from "../../../utils/components";
import Header from "../../../components/Header";
import { getSourceTypeFromPreviousPath } from "../utils";
import { SourceConceptDetails } from "../components";
import {
  retrieveActiveConceptsAction,
  retrieveConceptsAction,
  viewConceptsLoadingSelector,
  viewConceptsErrorsSelector,
  viewActiveConceptsLoadingSelector,
  viewActiveConceptsErrorsSelector
} from "../../concepts/redux";

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
  metaConceptsCount?: { num_found?: number };
  metaActiveConceptsCount?: { num_found?: number };
}
interface UseLocation {
  prevPath: string;
}
export const ViewSourcePage: React.FC<Props> = ({
  profile,
  usersOrgs = [],
  sourceLoading,
  source,
  retrieveSourceAndDetails,
  retrieveSourceErrors,
  retrieveConceptsSummary,
  retrieveActiveConceptsSummary,
  metaConceptsCount = {},
  metaActiveConceptsCount = {}
}: Props) => {
  const { pathname: url, state } = useLocation<UseLocation>();
  const previousPath = state ? state.prevPath : "";

  useEffect(() => {
    retrieveSourceAndDetails(url);
  }, [url, retrieveSourceAndDetails]);
  useEffect(() => {
    retrieveConceptsSummary({conceptsUrl: `${url}concepts/`, limit: 1, includeRetired: true});
  }, [url, retrieveConceptsSummary]);
  useEffect(() => {
    retrieveActiveConceptsSummary({conceptsUrl: `${url}concepts/`, limit: 1});
  }, [url, retrieveActiveConceptsSummary]);

  return (
    <Header
      title={`${getSourceTypeFromPreviousPath(previousPath)} > ${source?.name ||
        ""}`}
      justifyChildren='space-around'
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
        <Grid id='viewSourcePage' item xs={5} component='div'>
          <Paper className='fieldsetParent'>
            <fieldset>
              <Typography component='legend' variant='h5' gutterBottom>
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
          <Grid item xs={12} component='div'>
            <SourceConceptDetails
              source={source}
              totalConceptCount={metaConceptsCount.num_found || 0}
              activeConceptCount={metaActiveConceptsCount.num_found || 0}
            />
          </Grid>
        </Grid>
      </ProgressOverlay>
    </Header>
  );
};

export const mapStateToProps = (state: AppState) => ({
  profile: profileSelector(state),
  usersOrgs: orgsSelector(state),
  sourceLoading: retrieveSourceLoadingSelector(state)
                || viewConceptsLoadingSelector(state)
                || viewActiveConceptsLoadingSelector(state),
  source: sourceSelector(state),
  metaConceptsCount: state.concepts.concepts
    ? state.concepts.concepts.responseMeta
    : undefined,
  metaActiveConceptsCount: state.concepts.activeConcepts
      ? state.concepts.activeConcepts.responseMeta
      : undefined,
  retrieveSourceErrors: retrieveSourceErrorSelector(state)
                      || viewConceptsErrorsSelector(state)
                      || viewActiveConceptsErrorsSelector(state),
});
export const mapDispatchToProps = {
  retrieveSourceAndDetails: retrieveSourceAndDetailsAction,
  retrieveConceptsSummary: retrieveConceptsAction,
  retrieveActiveConceptsSummary: retrieveActiveConceptsAction
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewSourcePage);
