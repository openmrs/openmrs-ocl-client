import {
  errorSelector,
  loadingSelector,
  progressSelector
} from "../../../redux";
import { 
  CREATE_ORGANISATION_ACTION, 
  EDIT_ORGANISATION_ACTION, 
  GET_ORG_ACTION, 
  GET_USER_ORGS_ACTION,
  DELETE_ORGANISATION_ACTION } 
  from './actionTypes';

export const createOrganisationLoadingSelector = loadingSelector(
  CREATE_ORGANISATION_ACTION
);
export const createOrganisationProgressSelector = progressSelector(
  CREATE_ORGANISATION_ACTION
);
export const createOrganisationErrorSelector = errorSelector(
  CREATE_ORGANISATION_ACTION
);

export const deleteOrganisationErrorSelector = errorSelector(
  DELETE_ORGANISATION_ACTION
);

export const editOrganisationErrorSelector = errorSelector(
  EDIT_ORGANISATION_ACTION
);
export const editOrganisationLoadingSelector = loadingSelector(
  EDIT_ORGANISATION_ACTION
);

export const retrieveOrgsLoadingSelector = loadingSelector(
  GET_USER_ORGS_ACTION
);

export const retrieveOrgLoadingSelector = loadingSelector(
  GET_ORG_ACTION
);
