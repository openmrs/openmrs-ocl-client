import reducer from '../../../redux/reducers/bulkConcepts';
import {
  FETCH_SOURCE_CONCEPTS,
  IS_FETCHING,
  FETCH_CONCEPT_SOURCES,
  CLEAR_SOURCE_CONCEPTS,
} from '../../../redux/actions/types';

const initialState = { concepts: [], loading: false, conceptSources: [] };
describe('Test suite for vote reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should handle FETCH_SOURCE_CONCEPTS', () => {
    expect(reducer(
      {},
      {
        type: FETCH_SOURCE_CONCEPTS,
        payload: [],
      },
    )).toEqual({
      concepts: [],
    });
  });

  it('should handle FETCH_CONCEPT_SOURCES', () => {
    expect(reducer(
      {},
      {
        type: FETCH_CONCEPT_SOURCES,
        payload: [],
      },
    )).toEqual({
      conceptSources: [],
    });
  });

  it('should handle IS_FETCHING', () => {
    expect(reducer(
      {},
      {
        type: IS_FETCHING,
        payload: false,
      },
    )).toEqual({
      loading: false,
    });
  });

  it('should handle CLEAR_SOURCE_CONCEPTS', () => {
    expect(reducer(
      {},
      {
        type: CLEAR_SOURCE_CONCEPTS,
      },
    )).toEqual({
      concepts: [],
    });
  });
});
