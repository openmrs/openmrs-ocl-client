import { SEARCH_RESULTS, IS_FETCHING } from '../actions/types';

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
