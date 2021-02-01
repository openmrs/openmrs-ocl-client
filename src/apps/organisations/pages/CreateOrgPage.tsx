import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { OrganisationForm } from "../components";
import { Grid, Paper } from "@material-ui/core";
import {
  createOrganisationLoadingSelector,
  createOrganisationProgressSelector,
} from "../redux";

import { Organisation } from "../types";
import {
  createOrganisationAction,
  resetCreateOrganisationAction,
} from "../redux/actions";
import { usePrevious } from "../../../utils";
import { AppState } from "../../../redux";
import Header from "../../../components/Header";

import { getOrganisationTypeFromPreviousPath } from "../utils";
import { useLocation, useParams } from "react-router-dom";

interface Props {
  errors?: {};
  loading?: boolean;
  newOrganisation?: {};
  username?: string;
  createOrganisation: (
    ...args: Parameters<typeof createOrganisationAction>
  ) => void;
  resetCreateOrganisation: () => void;
}

interface UseLocation {
  prevPath: string;
}

const CreateOrganisationPage: React.FC<Props> = ({
  errors,
  loading,
  newOrganisation,
  createOrganisation,
  resetCreateOrganisation,
  username = "",
}: Props) => {
  const { pathname: url, state } = useLocation<UseLocation>();
  const previousPath = state ? state.prevPath : "";
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => resetCreateOrganisation(), []);

  const previouslyLoading = usePrevious(loading);

  if (!loading && previouslyLoading && newOrganisation) {
    return <Redirect to="/user/orgs/" />;
  }

  return (
    <Header
      title={`${getOrganisationTypeFromPreviousPath(
        previousPath
      )} > Create Organisation`}
      backUrl="/user/orgs/"
      backText="Back to organisations"
      justifyChildren="space-around"
    >
      <Grid id="create-organisation-page" item xs={6} component="div">
        <Paper>
          <OrganisationForm
            errors={errors}
            loading={loading}
            onSubmit={(values: Organisation) => createOrganisation(values)}
          />
        </Paper>
      </Grid>
    </Header>
  );
};

const mapStateToProps = (state: AppState) => ({
  newOrganisation: state.organisations.newOrganisation,
  loading: createOrganisationLoadingSelector(state),
  progress: createOrganisationProgressSelector(state),
  username: state.auth.profile?.username,
});
const mapActionsToProps = {
  createOrganisation: createOrganisationAction,
  resetCreateOrganisation: resetCreateOrganisationAction,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(CreateOrganisationPage);
