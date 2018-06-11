import { IS_FETCHING, FETCH_CONCEPTS } from '../actions/types';

const initialState = { concepts: [], loading: false };
export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CONCEPTS:
      return {
        ...state,
        concepts: action.payload,
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
