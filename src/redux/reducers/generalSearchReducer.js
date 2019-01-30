import { SEARCH_RESULTS, IS_FETCHING } from '../actions/types';

export const MIN_CHARACTERS_WARNING = 'Search query must contain at least 3 characters';
export const MILLISECONDS_TO_SHOW_WARNING = 4000;

const initialState = { dictionaries: [], loading: false };

export default (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_RESULTS:
      return {
        ...state,
        dictionaries: action.payload,
      };
    case IS_FETCHING:
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};
