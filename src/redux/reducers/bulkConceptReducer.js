import {
  FETCH_BULK_CONCEPTS,
  ADD_TO_DATATYPE_LIST,
  ADD_TO_CLASS_LIST,
  FETCH_FILTERED_CONCEPTS,
  PREVIEW_CONCEPT,
  SET_PERVIOUS_PAGE,
  SET_NEXT_PAGE,
  SET_CURRENT_PAGE,
} from '../actions/types';
import { normalizeList } from './util';
import { classes as classList, DATA_TYPES as dataTypesList } from '../../components/dictionaryConcepts/components/helperFunction';

const userInitialState = {
  bulkConcepts: [],
  datatypes: [],
  classes: [],
  datatypeList: [],
  classList: [],
  currentPage: 1,
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
    default:
      return state;
  }
};

export default bulkConcepts;
