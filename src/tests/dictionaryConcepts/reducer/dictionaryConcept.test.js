import deepFreeze from 'deep-freeze';
import reducer from '../../../redux/reducers/ConceptReducers';
import concepts from '../../__mocks__/concepts';
import { FETCH_DICTIONARY_CONCEPT } from '../../../redux/actions/types';

let state;
let action;

beforeEach(() => {
  state = {
    concepts: [],
    loading: false,
    dictionaryConcepts: [],
    filteredSources: [],
    filteredClass: [],
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
      filteredClass: ['Diagnosis'],
      filteredSources: ['CIEL'],
    });
  });
});
