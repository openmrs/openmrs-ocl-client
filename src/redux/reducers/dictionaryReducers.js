import { FETCHING_DICTIONARIES, IS_FETCHING, FETCHING_DICTIONARY, CLEAR_DICTIONARY } from '../actions/types';

const initalState = { dictionaries: [], loading: false, dictionary: {} };

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
