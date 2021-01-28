import {
  errorSelector,
  loadingSelector,
  progressSelector,
  indexedAction
} from "../../../redux";
import { 
  CREATE_ORGANISATION_ACTION, 
  EDIT_ORGANISATION_ACTION, 
  GET_ORG_ACTION, 
  GET_USER_ORGS_ACTION,
  RETRIEVE_ORGS_ACTION,
  DELETE_ORGANISATION_ACTION,
  CREATE_ORG_MEMBER_ACTION } 
  from './actionTypes';
import { PERSONAL_ORGS_ACTION_INDEX } from '../redux/constants';

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

export const retrievePublicOrganisationsLoadingSelector = loadingSelector(
  RETRIEVE_ORGS_ACTION
);
export const retrievePersonalOrganisationsLoadingSelector = loadingSelector(
  indexedAction(
    RETRIEVE_ORGS_ACTION,
    PERSONAL_ORGS_ACTION_INDEX
  )
);

export const addOrgMemberErrorSelector = errorSelector(
  CREATE_ORG_MEMBER_ACTION
);

export const addOrgMemberLoadingSelector = loadingSelector(
  CREATE_ORG_MEMBER_ACTION
);
