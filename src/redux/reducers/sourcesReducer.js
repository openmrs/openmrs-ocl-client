import { FETCH_SOURCES, IS_FETCHING } from '../actions/types';

const initialState = { sources: [], loading: false };
export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SOURCES:
      return {
        ...state,
        sources: action.payload,
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
