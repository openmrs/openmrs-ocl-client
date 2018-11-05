import { FETCH_CIEL_CONCEPTS, IS_FETCHING } from '../../actions/types';

const initialState = { cielConcepts: [], loading: false };
export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CIEL_CONCEPTS:
      return {
        ...state,
        cielConcepts: action.payload,
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
