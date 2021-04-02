import React, { useEffect } from "react";
import { Grid, Paper } from "@material-ui/core";
import { connect } from "react-redux";
import { Redirect, useLocation } from "react-router-dom";
import {
  editSourceDispatchAction,
  editSourceErrorsSelector,
  editSourceLoadingSelector,
  resetEditSourceAction,
  retrieveSourceAndDetailsAction
} from "../redux";
import { APISource, apiSourceToSource } from "../types";
import {
  orgsSelector,
  profileSelector
} from "../../authentication/redux/reducer";
import { APIOrg, APIProfile } from "../../authentication";
import { CONTEXT, ProgressOverlay, usePrevious } from "../../../utils";
import SourceForm from "../components/SourceForm";
import Header from "../../../components/Header";
import { EditMenu } from "../../containers/components/EditMenu";

export interface StateProps {
  errors?: {};
  profile?: APIProfile;
  usersOrgs?: APIOrg[];
  loading: boolean;
  source: APISource;
  editedSource?: APISource;
}

export interface ActionProps {
  editSourceAction: (
    ...args: Parameters<typeof editSourceDispatchAction>
  ) => void;

  retrieveSourceAction: (
    ...args: Parameters<typeof retrieveSourceAndDetailsAction>
  ) => void;
}

type Props = StateProps & ActionProps;

const EditSourcePage: React.FC<Props> = ({
  profile,
  usersOrgs,
  errors,
  loading,
  source,
  editedSource,
  editSourceAction,
  retrieveSourceAction
}: Props) => {
  const previouslyLoading = usePrevious(loading);
  const { pathname: url } = useLocation();
  const sourceUrl = url.replace("edit/", "");

  useEffect(() => {
    retrieveSourceAction(sourceUrl);
  }, [sourceUrl, retrieveSourceAction]);

  if (!loading && previouslyLoading && editedSource) {
    return <Redirect to={editedSource.url} />;
  }

  return (
    <Header title="Edit Source" backUrl={sourceUrl} backText="Back to Source">
      <ProgressOverlay delayRender loading={loading}>
        <Grid id="edit-source-page" item xs={6} component="div">
          <Paper>
            <SourceForm
              context={CONTEXT.edit}
              errors={errors}
              profile={profile}
              usersOrgs={usersOrgs ? usersOrgs : []}
              loading={loading}
              savedValues={apiSourceToSource(source)}
              onSubmit={(values: APISource) =>
                editSourceAction(values, source.url)
              }
            />
          </Paper>
        </Grid>
        <EditMenu backUrl={sourceUrl} />
      </ProgressOverlay>
    </Header>
  );
};

export const mapStateToProps = (state: any) => ({
  profile: profileSelector(state),
  usersOrgs: orgsSelector(state),
  loading: editSourceLoadingSelector(state),
  editedSource: state.sources.editedSource,
  source: state.sources.source,
  errors: editSourceErrorsSelector(state)
});
export const mapActionsToProps = {
  editSourceAction: editSourceDispatchAction,
  resetEditSourceAction: resetEditSourceAction,
  retrieveSourceAction: retrieveSourceAndDetailsAction
};

export default connect(mapStateToProps, mapActionsToProps)(EditSourcePage);
