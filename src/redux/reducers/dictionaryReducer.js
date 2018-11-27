import { FETCHING_ORGANIZATIONS, FETCH_DICTIONARY_MAPPINGS } from '../actions/types';

const initialState = {
  loading: false,
  mappings: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCHING_ORGANIZATIONS:
      return {
        ...state,
        organizations: action.payload,
      };
    case FETCH_DICTIONARY_MAPPINGS:
      return {
        ...state,
        mappings: action.payload,
      };
    default:
      return state;
  }
};
