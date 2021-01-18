import React, { useEffect} from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { OrganisationForm } from "../components";
import { Grid, Paper } from "@material-ui/core";
import {
  createOrganisationLoadingSelector,
  createOrganisationProgressSelector,
} from "../redux";

import { Organisation } from "../types";
import { createOrganisationAction, resetCreateOrganisationAction } from '../redux/actions';
import { usePrevious } from "../../../utils";
import {AppState} from "../../../redux";

interface Props {
  errors?: {};
  loading?: boolean;
  newOrganisation?: {};
  username?:string;
  createOrganisation: (
    ...args: Parameters<typeof createOrganisationAction>
  ) => void;
  resetCreateOrganisation: () => void;
}

const CreateOrganisationPage: React.FC<Props> = ({
  errors,
  loading,
  newOrganisation,
  createOrganisation,
  resetCreateOrganisation,
  username = ''
}: Props) => {
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => resetCreateOrganisation(), []);
  const previouslyLoading = usePrevious(loading);
  
  if (!loading && previouslyLoading && newOrganisation) {
    return <Redirect to='/user/orgs/' />;
  }

  return (
    <Grid id="create-organisation-page" item xs={6} component="div">
      <Paper>
        <OrganisationForm
          errors={errors}
          loading={loading}
          onSubmit={(values: Organisation) => createOrganisation(values)}
        />
      </Paper>
    </Grid>
  );
};

const mapStateToProps = (state: AppState) =>  ({
  newOrganisation: state.organisations.newOrganisation,
  loading: createOrganisationLoadingSelector(state),
  progress: createOrganisationProgressSelector(state),
  username: state.auth.profile?.username
});
const mapActionsToProps = {
  createOrganisation: createOrganisationAction,
  resetCreateOrganisation: resetCreateOrganisationAction
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(CreateOrganisationPage);
