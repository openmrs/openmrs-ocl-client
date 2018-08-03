import deepFreeze from 'deep-freeze';
import reducer from '../../../redux/reducers/bulkConceptReducer';
import {
  FETCH_BULK_CONCEPTS,
  ADD_TO_DATATYPE_LIST,
  ADD_TO_CLASS_LIST,
  FETCH_FILTERED_CONCEPTS,
} from '../../../redux/actions/types';
import concepts, { multipleConceptsMockStore } from '../../__mocks__/concepts';

let state;
let action;

beforeEach(() => {
  state = {
    bulkConcepts: [],
    datatypes: [],
    classes: [],
    datatypeList: [],
    classList: [],
  };
  action = {};
});

describe('Test suite for bulkConcepts reducer', () => {
  it('should not change state if no action passed', () => {
    expect(reducer(state, action)).toBe(state);
  });

  it('should handle FETCH_BULK_CONCEPTS', () => {
    action = {
      type: FETCH_BULK_CONCEPTS,
      payload: [concepts],
    };

    deepFreeze(state);
    deepFreeze(action);

    expect(reducer(state, action)).toEqual({
      ...state,
      classes: ['Diagnosis'],
      datatypes: ['N/A'],
      bulkConcepts: action.payload,
    });
  });
  it('should handle ADD_TO_DATATYPE_LIST', () => {
    action = {
      type: ADD_TO_DATATYPE_LIST,
      payload: 'Text',
    };

    deepFreeze(state);
    deepFreeze(action);

    expect(reducer(state, action)).toEqual({
      ...state,
      datatypeList: ['Text'],
    });
  });
  it('should handle ADD_TO_CLASS_LIST', () => {
    action = {
      type: ADD_TO_CLASS_LIST,
      payload: 'Diagnosis',
    };

    deepFreeze(state);
    deepFreeze(action);

    expect(reducer(state, action)).toEqual({
      ...state,
      classList: ['Diagnosis'],
    });
  });
  it('should handle FETCH_FILTERED_CONCEPTS', () => {
    action = {
      type: FETCH_FILTERED_CONCEPTS,
      payload: [multipleConceptsMockStore],
    };

    deepFreeze(state);
    deepFreeze(action);

    expect(reducer(state, action)).toEqual({
      ...state,
      bulkConcepts: action.payload,
    });
  });
});
