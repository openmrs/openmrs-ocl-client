import {
  FETCH_CONCEPTS,
  FILTER_BY_CLASS,
  FILTER_BY_SOURCES,
  FETCH_DICTIONARY_CONCEPT,
  POPULATE_SIDEBAR,
  IS_FETCHING,
  SEARCH_CONCEPTS,
  CLEAR_CONCEPTS,
  CREATE_NEW_NAMES,
  REMOVE_ONE_NAME,
  ADD_NEW_DESCRIPTION,
  REMOVE_ONE_DESCRIPTION,
  CLEAR_FORM_SELECTIONS,
  CREATE_NEW_CONCEPT,
  ADD_CONCEPT_TO_DICTIONARY,
  FETCH_NEXT_CONCEPTS,
  TOTAL_CONCEPT_COUNT,
  FETCH_EXISTING_CONCEPT,
  FETCH_EXISTING_CONCEPT_ERROR,
  EDIT_CONCEPT_ADD_DESCRIPTION,
  EDIT_CONCEPT_REMOVE_ONE_DESCRIPTION,
  CLEAR_PREVIOUS_CONCEPT,
  EDIT_CONCEPT_CREATE_NEW_NAMES,
  EDIT_CONCEPT_REMOVE_ONE_NAME,
  REMOVE_CONCEPT,
  QUERY_POSSIBLE_ANSWER_CONCEPTS,
  ADD_SELECTED_ANSWERS,
  CHANGE_ANSWER_MAPPING,
} from '../actions/types';
import {
  filterSources, filterClass, filterList, normalizeList, filterNames,
  filterDescriptions,
} from './util';

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
  newName: [],
  description: [],
  newConcept: {},
  addConceptToDictionary: [],
  paginatedConcepts: [],
  totalConceptCount: 0,
  existingConcept: {
    descriptions: [],
    names: [],
  },
  queryResults: [],
  selectedAnswers: [],
};

const answerFilter = (answers, id) => answers.filter(answer => answer.id === id)[0];

const changedAnswerIndex = (answers, id) => answers.findIndex(answer => answer.id === id);

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
    case FETCH_NEXT_CONCEPTS:
      return {
        ...state,
        paginatedConcepts: action.payload,
      };
    case REMOVE_CONCEPT:
      return {
        ...state,
        paginatedConcepts: state.paginatedConcepts
          .filter(concept => concept.version_url !== action.payload),
        dictionaryConcepts: state.dictionaryConcepts
          .filter(concept => concept.version_url !== action.payload),
      };
    case TOTAL_CONCEPT_COUNT:
      return {
        ...state,
        totalConceptCount: action.payload,
      };
    case ADD_CONCEPT_TO_DICTIONARY:
      return {
        ...state,
        addConceptToDictionary: action.payload,
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
    case CREATE_NEW_NAMES:
      return {
        ...state,
        newName: [...state.newName, action.payload],
      };
    case REMOVE_ONE_NAME:
      return {
        ...state,
        newName: filterNames(action.payload, state.newName),
      };
    case ADD_NEW_DESCRIPTION:
      return {
        ...state,
        description: [...state.description, action.payload],
      };
    case REMOVE_ONE_DESCRIPTION:
      return {
        ...state,
        description: filterNames(action.payload, state.description),
      };
    case CLEAR_FORM_SELECTIONS:
      return {
        ...state,
        description: action.payload,
        newName: action.payload,
        newConcept: {},
      };
    case CREATE_NEW_CONCEPT:
      return {
        ...state,
        newConcept: action.payload,
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
    case FETCH_EXISTING_CONCEPT:
      return {
        ...state,
        existingConcept: action.payload,
      };
    case CLEAR_PREVIOUS_CONCEPT:
      return {
        ...state,
        existingConcept: {
          descriptions: [],
          names: [],
        },
      };
    case EDIT_CONCEPT_ADD_DESCRIPTION:
      return {
        ...state,
        existingConcept: {
          ...state.existingConcept,
          descriptions: [
            ...state.existingConcept.descriptions,
            { uuid: action.payload },
          ],
        },
      };
    case EDIT_CONCEPT_CREATE_NEW_NAMES:
      return {
        ...state,
        existingConcept: {
          ...state.existingConcept,
          names: [
            ...state.existingConcept.names,
            { uuid: action.payload },
          ],
        },
      };
    case EDIT_CONCEPT_REMOVE_ONE_DESCRIPTION:
      return {
        ...state,
        existingConcept: {
          ...state.existingConcept,
          descriptions: filterDescriptions(action.payload, state.existingConcept.descriptions),
        },
      };
    case EDIT_CONCEPT_REMOVE_ONE_NAME:
      return {
        ...state,
        existingConcept: {
          ...state.existingConcept,
          names: filterDescriptions(action.payload, state.existingConcept.names),
        },
      };
    case FETCH_EXISTING_CONCEPT_ERROR:
      return {
        ...state,
      };
    case QUERY_POSSIBLE_ANSWER_CONCEPTS:
      return {
        ...state,
        queryResults: [...action.payload],
      };
    case ADD_SELECTED_ANSWERS:
      return {
        ...state,
        selectedAnswers: [...action.payload],
      };
    case CHANGE_ANSWER_MAPPING:
      // eslint-disable-next-line no-case-declarations
      const currentAnswer = answerFilter(state.selectedAnswers, action.payload.id);
      // eslint-disable-next-line no-case-declarations
      const newCurrentAnswer = Object.assign(currentAnswer, action.payload);
      // eslint-disable-next-line no-case-declarations
      const newSelectedAnswers = state.selectedAnswers;
      // eslint-disable-next-line no-case-declarations
      const changedIndex = changedAnswerIndex(state.selectedAnswers, action.payload.id);
      newSelectedAnswers[changedIndex] = newCurrentAnswer;
      return {
        ...state,
        selectedAnswers: [...newSelectedAnswers],
      };
    default:
      return state;
  }
};
