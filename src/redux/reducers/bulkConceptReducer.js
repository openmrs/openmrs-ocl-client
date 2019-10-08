import {
  FETCH_BULK_CONCEPTS,
  ADD_TO_DATATYPE_LIST,
  ADD_TO_CLASS_LIST,
  FETCH_FILTERED_CONCEPTS,
  PREVIEW_CONCEPT,
  SET_PERVIOUS_PAGE,
  SET_NEXT_PAGE,
  SET_CURRENT_PAGE,
  CLEAR_BULK_FILTERS,
  SET_SORT_CRITERIA,
  SET_SORT_DIRECTION,
} from '../actions/types';
import { normalizeList } from './util';
import { classes as classList, DATA_TYPES as dataTypesList } from '../../components/dictionaryConcepts/components/helperFunction';
import { FILTER_TYPES } from '../../constants';

const userInitialState = {
  bulkConcepts: [],
  datatypes: [],
  classes: [],
  datatypeList: [],
  classList: [],
  currentPage: 1,
  sortCriteria: 'name',
  sortDirection: 'sortAsc',
};
const bulkConcepts = (state = userInitialState, action) => {
  switch (action.type) {
    case FETCH_BULK_CONCEPTS:
      return {
        ...state,
        bulkConcepts: action.payload,
        datatypes: dataTypesList,
        classes: classList,
      };
    case FETCH_FILTERED_CONCEPTS:
      return {
        ...state,
        bulkConcepts: action.payload,
        datatypes: dataTypesList,
        classes: classList,
      };
    case PREVIEW_CONCEPT:
      return {
        ...state,
        preview: action.payload,
      };
    case SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.payload,
      };
    case SET_NEXT_PAGE:
      return {
        ...state,
        currentPage: state.currentPage + 1,
      };
    case SET_PERVIOUS_PAGE:
      return {
        ...state,
        currentPage: state.currentPage - 1,
      };
    case ADD_TO_DATATYPE_LIST:
      return {
        ...state,
        datatypeList: normalizeList(action.payload, [action.payload, ...state.datatypeList]),
      };
    case ADD_TO_CLASS_LIST:
      return {
        ...state,
        classList: normalizeList(action.payload, [action.payload, ...state.classList]),
      };
    case CLEAR_BULK_FILTERS:
      switch (action.payload) {
        case FILTER_TYPES.DATATYPE: return { ...state, datatypeList: [] };
        case FILTER_TYPES.CLASSES: return { ...state, classList: [] };
        default: return state;
      }
    case SET_SORT_CRITERIA:
      return { ...state, sortCriteria: action.payload };
    case SET_SORT_DIRECTION:
      return { ...state, sortDirection: action.payload };
    default:
      return state;
  }
};

export default bulkConcepts;
