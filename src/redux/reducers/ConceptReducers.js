import {
  FETCH_CONCEPTS,
  FILTER_BY_CLASS,
  FILTER_BY_SOURCES,
  FETCH_DICTIONARY_CONCEPT,
  POPULATE_SIDEBAR,
  IS_FETCHING,
  SEARCH_CONCEPTS,
  CLEAR_CONCEPTS,
} from '../actions/types';
import { filterSources, filterClass, filterList, normalizeList } from './util';

const initialState = {
  concepts: [],
  loading: false,
  dictionaryConcepts: [],
  filteredSources: [],
  filteredClass: [],
  filteredList: [],
  filteredByClass: [],
  filteredBySource: [],
  sourceList: [],
  classList: [],
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
    case FILTER_BY_SOURCES:
      return {
        ...state,
        sourceList: normalizeList(action.payload, [action.payload, ...state.sourceList]),
        filteredBySource: filterList(action.payload, state.sourceList),
      };
    case FILTER_BY_CLASS:
      return {
        ...state,
        classList: normalizeList(action.payload, [action.payload, ...state.classList]),
        filteredByClass: filterList(action.payload, state.classList),
      };
    case FETCH_DICTIONARY_CONCEPT:
      return {
        ...state,
        dictionaryConcepts: action.payload,
      };
    case POPULATE_SIDEBAR:
      return {
        ...state,
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
