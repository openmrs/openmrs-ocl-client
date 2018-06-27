import reducer from '../../../redux/reducers/ConceptReducers';
import { FETCH_CONCEPTS, IS_FETCHING } from '../../../redux/actions/types';
import concepts from '../../__mocks__/concepts';

const initialState = {
  concepts: [],
  loading: false,
  dictionaryConcepts: [],
  filteredSources: [],
  filteredClass: [],
  hasMore: false,
};
describe('Test suite for concepts reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should handle FETCH_CONCEPTS', () => {
    expect(reducer(
      { concepts: [] },
      {
        type: FETCH_CONCEPTS,
        payload: [concepts],
      },
    )).toEqual({
      concepts: [concepts],
      hasMore: false,
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
});
