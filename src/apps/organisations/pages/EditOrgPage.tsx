import React, {useEffect, useState} from "react";
import {isEmpty} from 'lodash';
import {OrganisationForm} from "../components";
import {Grid, Paper} from "@material-ui/core";
import {connect} from "react-redux";
import {Redirect, useLocation} from "react-router-dom";
import {
  editOrganisationAction,
  retrieveOrganisationAction,
  editOrganisationLoadingSelector,
  deleteOrganisationAction,
  deleteOrganisationErrorSelector,
  editOrganisationErrorSelector
} from "../redux";
import {APIOrganisation, EditableOrganisationFields} from "../types";
import {CONTEXT, usePrevious} from "../../../utils"
import {ProgressOverlay, ConfirmationDialog, ToastAlert} from "../../../utils/components";
import Header from "../../../components/Header";
import {MenuButton} from "../components";
import { AppState } from "../../../redux";
interface Props {
  errors?:{};
  editError?: {};
  loading: boolean;
  editedOrganisation?: APIOrganisation;
  organisation?: APIOrganisation;
  deleteError?: string;
  editOrg: (
    ...args: Parameters<typeof editOrganisationAction>
  ) => void;
  retrieveOrg: (
    ...args: Parameters<typeof retrieveOrganisationAction>
  ) => void;
  deleteOrg: (
    ...args: Parameters<typeof deleteOrganisationAction>
  ) => void;
}

const EditOrganisationPage: React.FC<Props> = ({
  errors,
  editError = '',
  deleteError = '',
  loading,
  organisation,
  editedOrganisation,
  editOrg,
  retrieveOrg,
  deleteOrg
}: Props) => {

  const [openDialog, setOpenDialog] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const { pathname } = useLocation();
  
  const orgUrl = pathname.replace("/user", "").replace("edit/", "");
  
  const previouslyLoading = usePrevious(loading);

  useEffect(() => {
     retrieveOrg(orgUrl);
  }, [orgUrl, retrieveOrg]);

  if (!loading && previouslyLoading && editedOrganisation) {
    return (
      <Redirect to='/user/orgs' />
    );
  }
  const { name = '' } = organisation || {};
  
  const confirmationMsg = () => {
    return (
      <div>
        <h5 id="modal-title">
          Delete: <b>{name}</b>
        </h5>
        <p id="delete-modal-description">
          Are you sure you want to Delete? This could mean that you loose all the data within this organisation.
        </p>
      </div>
    );
  };
  
  return (
    <Header
      title="Edit Organisation"
      backUrl={orgUrl}
      backText="Back to organisation"
    >
      <ToastAlert open={openAlert} setOpen={() => setOpenAlert(!openAlert)} message={deleteError} type="error"/>
       {editError ? <ToastAlert open={openAlert} setOpen={() => setOpenAlert(!openAlert)} message="An error occured" type="error"/> : null }
      <ProgressOverlay loading={loading}>
        <Grid id="edit-organisation-page" item xs={6} component="div">
          <Paper>
            <OrganisationForm
              context={CONTEXT.edit}
              errors={errors}
              loading={loading}
              savedValues={!isEmpty(organisation) ? organisation: organisation}
              onSubmit={(values: EditableOrganisationFields) => {
                editOrg(orgUrl, values);
                setOpenAlert(true);
              }}
            />
          </Paper>
        </Grid>
        <MenuButton backUrl={orgUrl} confirmDelete={() => setOpenDialog(true)}/>
        <ConfirmationDialog
          open={openDialog}
          setOpen={() => setOpenDialog(!openDialog)}
          onConfirm={() => 
            {
              deleteOrg(orgUrl);
              setOpenDialog(!openDialog);
              setOpenAlert(true);
            }}
          message={confirmationMsg()}
          cancelButtonText={"No"}
          confirmButtonText={"Yes"} />
      </ProgressOverlay>
    </Header>
  );
};

const mapStateToProps = (state: AppState) => ({
  editedOrganisation: state.organisations.editedOrganisation,
  organisation: state.organisations.organisation,
  loading: editOrganisationLoadingSelector(state),
  deleteError: deleteOrganisationErrorSelector(state),
  editError: editOrganisationErrorSelector(state)
});

const mapActionsToProps = {
  editOrg: editOrganisationAction,
  retrieveOrg: retrieveOrganisationAction,
  deleteOrg: deleteOrganisationAction
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(EditOrganisationPage);
