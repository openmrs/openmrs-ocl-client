import { FETCHING_DICTIONARIES, IS_FETCHING, FETCHING_DICTIONARY, CLEAR_DICTIONARY, FETCHING_VERSIONS } from '../actions/types';

const initalState = {
  versions: [], dictionaries: [], loading: false, dictionary: {},
};

export default (state = initalState, action) => {
  switch (action.type) {
    case FETCHING_DICTIONARIES:
      return {
        ...state,
        dictionaries: action.payload,
      };
    case IS_FETCHING:
      return {
        ...state,
        loading: action.payload,
      };
    case FETCHING_VERSIONS:
      return {
        ...state,
        versions: action.payload,
      };
    case FETCHING_DICTIONARY:
      return {
        ...state,
        dictionary: action.payload,
      };
    case CLEAR_DICTIONARY:
      return {
        ...state,
        dictionary: {},
      };
    default:
      return state;
  }
};
