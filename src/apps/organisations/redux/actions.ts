import api from "../api";
import { 
  createActionThunk, 
  startAction, 
  completeAction,
  progressAction,
  resetAction,
  indexedAction
 } from "../../../redux";
import {
  CREATE_ORGANISATION_ACTION,
  EDIT_ORGANISATION_ACTION,
  GET_ORG_ACTION,
  GET_ORG_COLLECTIONS_ACTION,
  GET_ORG_SOURCES_ACTION,
  DELETE_ORGANISATION_ACTION,
  RETRIEVE_ORGS_ACTION
} from "./actionTypes";
import {PERSONAL_ORGS_ACTION_INDEX} from "./constants";
import { Organisation, EditableOrganisationFields } from '../types';

const createOrgsAction = createActionThunk(
  CREATE_ORGANISATION_ACTION,
  api.create
);

const editOrgsAction = createActionThunk(
  EDIT_ORGANISATION_ACTION,
  api.organisation.update
);

const retrieveOrgAction =  createActionThunk(
  GET_ORG_ACTION,
  api.organisation.retrieve
);


const retrievePublicOrganisationsAction = createActionThunk(
  RETRIEVE_ORGS_ACTION,
  api.organisations.retrieve.public
);

const retrievePersonalOrganisationsAction = createActionThunk(
  indexedAction(
    RETRIEVE_ORGS_ACTION,
    PERSONAL_ORGS_ACTION_INDEX
  ),
  api.organisations.retrieve.private
);

const createOrganisationAction = (organisationData: Organisation) => {
  return async (dispatch: Function) => {
    dispatch(startAction(CREATE_ORGANISATION_ACTION));
    let organisationResponse;
    organisationResponse = await dispatch(
      createOrgsAction<Organisation>(organisationData)
    );
    dispatch(
      progressAction(CREATE_ORGANISATION_ACTION, "Creating organisation...")
    );
    if (!organisationResponse) {
      dispatch(completeAction(CREATE_ORGANISATION_ACTION));
      return false;
    }

    dispatch(completeAction(CREATE_ORGANISATION_ACTION));
  }
}

const editOrganisationAction = (orgUrl: string, edittedOrganisation: EditableOrganisationFields) => {
  return async (dispatch: Function) => {
    dispatch(startAction(EDIT_ORGANISATION_ACTION));
    let organisationResponse;
    organisationResponse = await dispatch(
      editOrgsAction<EditableOrganisationFields>(orgUrl, edittedOrganisation)
    );
    dispatch(
      progressAction(EDIT_ORGANISATION_ACTION, "Editing organisation...")
    );
    if (!organisationResponse) {
      dispatch(completeAction(EDIT_ORGANISATION_ACTION));
      return false;
    }

    dispatch(completeAction(EDIT_ORGANISATION_ACTION));
  }
}

const resetCreateOrganisationAction = () => {
  return (dispatch: Function) => {
    dispatch(resetAction(CREATE_ORGANISATION_ACTION));
  }
}

const resetEditOrganisationAction = () => {
  return (dispatch: Function) => {
    dispatch(resetAction(EDIT_ORGANISATION_ACTION));
  }
};

const retrieveOrganisationAction = (orgUrl: string) => {
  return async (dispatch: Function) => {
    await dispatch(
      retrieveOrgAction(orgUrl)
    );
  
  };
};


const retrieveOrgSourcesAction = createActionThunk(
  GET_ORG_SOURCES_ACTION,
  api.organisation.retrieveSources
);

const retrieveOrgCollectionsAction = createActionThunk(
  GET_ORG_COLLECTIONS_ACTION,
  api.organisation.retrieveCollections
);

const deleteOrganisationAction = createActionThunk(
  DELETE_ORGANISATION_ACTION,
  api.organisation.delete
);




export { 
  createOrganisationAction,
  resetCreateOrganisationAction,
  editOrganisationAction,
  retrieveOrganisationAction,
  resetEditOrganisationAction,
  retrieveOrgCollectionsAction,
  retrieveOrgSourcesAction,
  deleteOrganisationAction,
  retrievePublicOrganisationsAction,
  retrievePersonalOrganisationsAction
 };
 