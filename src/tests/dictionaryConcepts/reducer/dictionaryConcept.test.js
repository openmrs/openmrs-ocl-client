import deepFreeze from 'deep-freeze';
import reducer from '../../../redux/reducers/ConceptReducers';
import concepts, { newConcept } from '../../__mocks__/concepts';
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
} from '../../../redux/actions/types';

let state;
let action;

beforeEach(() => {
  state = {
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
    newName: ['456'],
    description: ['456'],
    newConcept: {},
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
      payload: [concepts],
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
      newName: ['123', '456'],
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
      description: ['123', '456'],
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
});
