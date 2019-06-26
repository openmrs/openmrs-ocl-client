import { FETCHING_ORGANIZATIONS, SET_DICTIONARIES_OWNED_BY_A_USERS_ORGS } from '../actions/types';

export const defaultState = {
  organizations: [],
  dictionariesOwnedByUsersOrg: [],
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case FETCHING_ORGANIZATIONS:
      return {
        ...state,
        organizations: action.payload,
      };
    case SET_DICTIONARIES_OWNED_BY_A_USERS_ORGS:
      return {
        ...state,
        dictionariesOwnedByUsersOrg: action.payload,
      };
    default:
      return state;
  }
};
