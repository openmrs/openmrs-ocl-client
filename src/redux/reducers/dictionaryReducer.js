import { ADDING_DICTIONARY, FETCHING_ORGANIZATIONS } from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case ADDING_DICTIONARY:
      return {
        ...state,
        dictionaries: action.payload,
      };
    case FETCHING_ORGANIZATIONS:
      return {
        ...state,
        organizations: action.payload,
      };
    default:
      return state;
  }
};
