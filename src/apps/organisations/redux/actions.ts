import api from "../api";
import { 
  createActionThunk, 
  startAction, 
  completeAction,
  progressAction,
  resetAction
 } from "../../../redux";
import {
  GET_USER_ORGS_ACTION,
  GET_PROFILE_ACTION,
  CREATE_ORGANISATION_ACTION
} from "./actionTypes";
import { Organisation } from '../types';

const createOrgsAction = createActionThunk(
  CREATE_ORGANISATION_ACTION,
  api.create
);

const getProfileAction = createActionThunk(GET_PROFILE_ACTION, api.getProfile);

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

const resetCreateOrganisationAction = () => {
  return (dispatch: Function) => {
    dispatch(resetAction(CREATE_ORGANISATION_ACTION));
  }
}

const retrieveOrganisationsAction = createActionThunk(
  GET_USER_ORGS_ACTION,
  api.retrieve
);

export { 
  createOrganisationAction,
  resetCreateOrganisationAction,
  retrieveOrganisationsAction,
  getProfileAction
 };