import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Redirect, useLocation } from "react-router-dom";
import { OrganisationForm } from "../components";
import { Grid, Paper } from "@material-ui/core";
import {
  createOrganisationErrorSelector,
  createOrganisationLoadingSelector
} from "../redux";
import { APIOrganisation, Organisation } from "../types";
import {
  createOrganisationAction,
  resetCreateOrganisationAction
} from "../redux/actions";
import { usePrevious } from "../../../utils";
import { AppState } from "../../../redux";
import Header from "../../../components/Header";
import { getOrganisationTypeFromPreviousPath } from "../utils";

interface Props {
  errors?: {};
  loading: boolean;
  newOrganisation?: APIOrganisation;
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
  resetCreateOrganisation
}: Props) => {
  const { state } = useLocation<UseLocation>();
  const previousPath = state ? state.prevPath : "";
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => resetCreateOrganisation(), []);

  const previouslyLoading = usePrevious(loading);

  console.log("errors", errors);

  if (!loading && previouslyLoading && newOrganisation && !errors) {
    // TODO Fix this when we have a working "My Organisation" page
    // return <Redirect to="/user/orgs" />
    return <Redirect to={newOrganisation.url} />;
  }

  return (
    <Header
      title={`${getOrganisationTypeFromPreviousPath(
        previousPath
      )} > Create Organisation`}
      backUrl="/orgs/"
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
  username: state.auth.profile?.username,
  errors: createOrganisationErrorSelector(state)
});
const mapActionsToProps = {
  createOrganisation: createOrganisationAction,
  resetCreateOrganisation: resetCreateOrganisationAction
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(CreateOrganisationPage);
