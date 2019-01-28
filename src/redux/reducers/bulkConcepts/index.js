import {
  FETCH_SOURCE_CONCEPTS,
  IS_FETCHING,
  FETCH_CONCEPT_SOURCES,
  CLEAR_SOURCE_CONCEPTS,
  IS_LOADING,
} from '../../actions/types';

const initialState = {
  concepts: [], loading: false, spinning: false, conceptSources: [],
};
export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SOURCE_CONCEPTS:
      return {
        ...state,
        concepts: action.payload,
      };
    case FETCH_CONCEPT_SOURCES:
      return {
        ...state,
        conceptSources: action.payload,
      };
    case IS_FETCHING:
      return {
        ...state,
        loading: action.payload,
      };
    case IS_LOADING:
      return {
        ...state,
        spinning: action.payload,
      };
    case CLEAR_SOURCE_CONCEPTS:
      return {
        ...state,
        concepts: [],
      };
    default:
      return state;
  }
};
