import {
  errorSelector,
  loadingSelector,
  progressSelector
} from "../../../redux";
import { CREATE_ORGANISATION_ACTION } from './actionTypes';

export const createOrganisationLoadingSelector = loadingSelector(
  CREATE_ORGANISATION_ACTION
);
export const createOrganisationProgressSelector = progressSelector(
  CREATE_ORGANISATION_ACTION
);
export const createOrganisationErrorSelector = errorSelector(
  CREATE_ORGANISATION_ACTION
);
