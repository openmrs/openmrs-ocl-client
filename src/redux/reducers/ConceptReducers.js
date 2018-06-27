import { IS_FETCHING, FETCH_CONCEPTS, FETCH_DICTIONARY_CONCEPT, SEARCH_CONCEPTS, CLEAR_CONCEPTS } from '../actions/types';
import { filterSources, filterClass } from './util';

const initialState = {
  concepts: [],
  loading: false,
  dictionaryConcepts: [],
  filteredSources: [],
  filteredClass: [],
  hasMore: false,
};
export default (state = initialState, action) => {
  const calculatePayload = () => {
    if (action.payload.length === 25) {
      return {
        ...state,
        concepts: [...state.concepts, ...action.payload],
        hasMore: true,
      };
    }
    return {
      ...state,
      concepts: [...state.concepts, ...action.payload],
      hasMore: false,
    };
  };
  switch (action.type) {
    case FETCH_CONCEPTS:
      return calculatePayload();
    case IS_FETCHING:
      return {
        ...state,
        loading: action.payload,
      };
    case FETCH_DICTIONARY_CONCEPT:
      return {
        ...state,
        dictionaryConcepts: action.payload,
        filteredSources: filterSources(action.payload),
        filteredClass: filterClass(action.payload),
      };
    case SEARCH_CONCEPTS:
      return {
        ...state,
        loading: action.payload,
        hasMore: false,
      };
    case CLEAR_CONCEPTS:
      return {
        ...state,
        concepts: [],
      };
    default:
      return state;
  }
};
