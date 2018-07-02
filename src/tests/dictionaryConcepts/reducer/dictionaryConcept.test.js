import deepFreeze from 'deep-freeze';
import reducer from '../../../redux/reducers/ConceptReducers';
import concepts from '../../__mocks__/concepts';
import {
  FETCH_DICTIONARY_CONCEPT,
  FILTER_BY_SOURCES,
  FILTER_BY_CLASS,
  POPULATE_SIDEBAR,
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
});
