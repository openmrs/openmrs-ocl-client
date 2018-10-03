import {
  FETCHING_DICTIONARIES,
  IS_FETCHING,
  FETCHING_DICTIONARY,
  CLEAR_DICTIONARY,
  FETCHING_VERSIONS,
  EDIT_DICTIONARY_SUCCESS,
  CREATING_RELEASED_VERSION,
  CREATING_RELEASED_VERSION_FAILED,
  RELEASING_HEAD_VERSION,
} from '../actions/types';

const initalState = {
  versions: [], dictionaries: [], loading: false, dictionary: {}, isReleased: false, error: [],
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
    case RELEASING_HEAD_VERSION:
      return {
        ...state,
        isReleased: action.payload.released,
      };
    case CLEAR_DICTIONARY:
      return {
        ...state,
        dictionary: {},
      };
    case EDIT_DICTIONARY_SUCCESS:
      return {
        ...state,
        dictionary: action.payload,
      };
    case CREATING_RELEASED_VERSION:
      return {
        ...state,
        isReleased: action.payload.released,
      };
    case CREATING_RELEASED_VERSION_FAILED:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};
