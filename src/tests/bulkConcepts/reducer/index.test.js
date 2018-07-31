import deepFreeze from 'deep-freeze';
import reducer from '../../../redux/reducers/bulkConceptReducer';
import { FETCH_BULK_CONCEPTS } from '../../../redux/actions/types';
import concepts from '../../__mocks__/concepts';

let state;
let action;

beforeEach(() => {
  state = { bulkConcepts: [] };
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
      bulkConcepts: action.payload,
    });
  });
});
