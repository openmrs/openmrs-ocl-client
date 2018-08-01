import { FETCHING_ORGANIZATIONS } from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case FETCHING_ORGANIZATIONS:
      return {
        ...state,
        organizations: action.payload,
      };
    default:
      return state;
  }
};
