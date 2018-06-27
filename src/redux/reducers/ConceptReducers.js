import { IS_FETCHING, FETCH_CONCEPTS, FETCH_DICTIONARY_CONCEPT } from '../actions/types';
import { filterSources, filterClass } from './util';

const initialState = {
  concepts: [],
  loading: false,
  dictionaryConcepts: [],
  filteredSources: [],
  filteredClass: [],
};
export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CONCEPTS:
      return {
        ...state,
        concepts: action.payload,
      };
    case FETCH_DICTIONARY_CONCEPT:
      return {
        ...state,
        dictionaryConcepts: action.payload,
        filteredSources: filterSources(action.payload),
        filteredClass: filterClass(action.payload),
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
