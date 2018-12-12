import deepFreeze from 'deep-freeze';
import reducer from '../../../redux/reducers/ConceptReducers';
import concepts, {
  concept2, newConcept, existingConcept, paginatedConcepts,
} from '../../__mocks__/concepts';
import {
  FETCH_DICTIONARY_CONCEPT,
  FILTER_BY_SOURCES,
  FILTER_BY_CLASS,
  POPULATE_SIDEBAR,
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
} from '../../../redux/actions/types';

let state;
let action;

beforeEach(() => {
  state = {
    concepts: [],
    loading: false,
    dictionaryConcepts: [paginatedConcepts.concepts],
    paginatedConcepts: [paginatedConcepts.concepts],
    filteredSources: [],
    filteredClass: [],
    filteredList: [],
    filteredByClass: [],
    filteredBySource: [],
    sourceList: [],
    classList: [],
    newName: ['456'],
    description: ['456'],
    answer: ['123y'],
    newConcept: {},
    addConceptToDictionary: [],
    existingConcept: {
      descriptions: [{
        uuid: '1234',
      }],
      names: [{
        uuid: '5678',
      }],
    },
  };
  action = {};
});

describe('Test suite for single dictionary concepts', () => {
  it('should not change state if no action passed', () => {
    expect(reducer(state, action)).toBe(state);
  });

  it('should respond with the correct payload', () => {
    action = {
      type: FETCH_DICTIONARY_CONCEPT,
      loading: false,
      payload: [concepts],
    };

    deepFreeze(state);
    deepFreeze(action);

    expect(reducer(state, action)).toEqual({
      ...state,
      dictionaryConcepts: [concepts],
      filteredClass: [],
      filteredSources: [],
    });
  });

  it('should handle search filtering by source', () => {
    action = {
      type: FILTER_BY_SOURCES,
      payload: 'dev-col',
    };

    deepFreeze(state);
    deepFreeze(action);

    expect(reducer(state, action)).toEqual({
      ...state,
      sourceList: ['dev-col'],
      filteredBySource: ['dev-col'],
    });
  });
  it('should handle search filtering by class', () => {
    action = {
      type: FILTER_BY_CLASS,
      payload: 'dev-col',
    };

    deepFreeze(state);
    deepFreeze(action);

    expect(reducer(state, action)).toEqual({
      ...state,
      classList: ['dev-col'],
      filteredByClass: ['dev-col'],
    });
  });

  it('should handle sidebar items', () => {
    action = {
      type: POPULATE_SIDEBAR,
      payload: [concepts, concept2],
    };

    deepFreeze(state);
    deepFreeze(action);

    expect(reducer(state, action)).toEqual({
      ...state,
      filteredSources: ['CIEL'],
      filteredClass: ['Diagnosis'],
    });
  });
  it('should handle CREATE_NEW_NAMES', () => {
    action = {
      type: CREATE_NEW_NAMES,
      payload: '123',
    };

    deepFreeze(state);
    deepFreeze(action);

    expect(reducer(state, action)).toEqual({
      ...state,
      newName: ['456', '123'],
    });
  });
  it('should handle REMOVE_ONE_NAME', () => {
    action = {
      type: REMOVE_ONE_NAME,
      payload: '123',
    };

    deepFreeze(state);
    deepFreeze(action);

    expect(reducer(state, action)).toEqual({
      ...state,
      newName: ['456'],
    });
  });
  it('should handle ADD_NEW_DESCRIPTION', () => {
    action = {
      type: ADD_NEW_DESCRIPTION,
      payload: '123',
    };

    deepFreeze(state);
    deepFreeze(action);

    expect(reducer(state, action)).toEqual({
      ...state,
      description: ['456', '123'],
    });
  });

  it('should handle REMOVE_ONE_DESCRIPTION', () => {
    action = {
      type: REMOVE_ONE_DESCRIPTION,
      payload: '123',
    };

    deepFreeze(state);
    deepFreeze(action);

    expect(reducer(state, action)).toEqual({
      ...state,
      description: ['456'],
    });
  });
  it('should handle CLEAR_FORM_SELECTIONS', () => {
    action = {
      type: CLEAR_FORM_SELECTIONS,
      payload: [],
    };

    deepFreeze(state);
    deepFreeze(action);

    expect(reducer(state, action)).toEqual({
      ...state,
      description: action.payload,
      newName: action.payload,
      newConcept: {},
    });
  });
  it('should handle CREATE_NEW_CONCEPT', () => {
    action = {
      type: CREATE_NEW_CONCEPT,
      payload: newConcept,
    };

    deepFreeze(state);
    deepFreeze(action);

    expect(reducer(state, action)).toEqual({
      ...state,
      newConcept: action.payload,
    });
  });
  it('should handle ADD_CONCEPT_TO_DICTIONARY', () => {
    action = {
      type: ADD_CONCEPT_TO_DICTIONARY,
      payload: { added: true },
    };

    deepFreeze(state);
    deepFreeze(action);

    expect(reducer(state, action)).toEqual({
      ...state,
      addConceptToDictionary: action.payload,
    });
  });
  it('should handle FETCH_NEXT_CONCEPT', () => {
    action = {
      type: FETCH_NEXT_CONCEPTS,
      payload: [concepts],
    };

    deepFreeze(state);
    deepFreeze(action);

    expect(reducer(state, action)).toEqual({
      ...state,
      paginatedConcepts: action.payload,
    });
  });
  it('should handle TOTAL_CONCEPT_COUNT', () => {
    action = {
      type: TOTAL_CONCEPT_COUNT,
      payload: 1,
    };

    deepFreeze(state);
    deepFreeze(action);

    expect(reducer(state, action)).toEqual({
      ...state,
      totalConceptCount: action.payload,
    });
  });

  it('should handle REMOVE_CONCEPT', () => {
    action = {
      type: REMOVE_CONCEPT,
      payload: '/URL',
    };

    deepFreeze(state);
    deepFreeze(action);

    expect(reducer(state, action)).toEqual({
      ...state,
      paginatedConcepts: state.paginatedConcepts
        .filter(concept => concept.version_url !== action.payload),
      dictionaryConcepts: state.dictionaryConcepts
        .filter(concept => concept.version_url !== action.payload),
    });
  });

  it('should handle FETCH_EXISTING_CONCEPT', () => {
    action = {
      type: FETCH_EXISTING_CONCEPT,
      payload: existingConcept,
    };

    deepFreeze(state);
    deepFreeze(action);

    expect(reducer(state, action)).toEqual({
      ...state,
      existingConcept: action.payload,
    });
  });
  it('should handle EDIT_CONCEPT_ADD_DESCRIPTION', () => {
    action = {
      type: EDIT_CONCEPT_ADD_DESCRIPTION,
      payload: '1234-abcd-2345-cfgh',
    };

    deepFreeze(state);
    deepFreeze(action);

    expect(reducer(state, action)).toEqual({
      ...state,
      existingConcept: {
        ...state.existingConcept,
        descriptions: [
          ...state.existingConcept.descriptions,
          { uuid: action.payload },
        ],
      },
    });
  });
  it('should handle FETCH_EXISTING_CONCEPT_ERROR', () => {
    action = {
      type: FETCH_EXISTING_CONCEPT_ERROR,
    };

    deepFreeze(state);
    deepFreeze(action);

    expect(reducer(state, action)).toEqual({
      ...state,
    });
  });
  it('should handle EDIT_CONCEPT_REMOVE_ONE_DESCRIPTION', () => {
    action = {
      type: EDIT_CONCEPT_REMOVE_ONE_DESCRIPTION,
      payload: '1234',
    };

    deepFreeze(state);
    deepFreeze(action);

    expect(reducer(state, action)).toEqual({
      ...state,
      existingConcept: {
        ...state.existingConcept,
        descriptions: [],
      },
    });
  });
  it('should handle CLEAR_PREVIOUS_CONCEPT', () => {
    action = {
      type: CLEAR_PREVIOUS_CONCEPT,
    };

    deepFreeze(state);
    deepFreeze(action);

    expect(reducer(state, action)).toEqual({
      ...state,
      existingConcept: {
        descriptions: [],
        names: [],
      },
    });
  });
  it('should handle EDIT_CONCEPT_CREATE_NEW_NAMES', () => {
    action = {
      type: EDIT_CONCEPT_CREATE_NEW_NAMES,
      payload: 'wedfr-abcd-2345-cfgh',
    };

    deepFreeze(state);
    deepFreeze(action);

    expect(reducer(state, action)).toEqual({
      ...state,
      existingConcept: {
        ...state.existingConcept,
        names: [
          ...state.existingConcept.names,
          { uuid: action.payload },
        ],
      },
    });
  });
  it('should handle EDIT_CONCEPT_REMOVE_ONE_NAME', () => {
    action = {
      type: EDIT_CONCEPT_REMOVE_ONE_NAME,
      payload: '5678',
    };

    deepFreeze(state);
    deepFreeze(action);

    expect(reducer(state, action)).toEqual({
      ...state,
      existingConcept: {
        ...state.existingConcept,
        names: [],
      },
    });
  });
});
