import reducer from '../../../redux/reducers/bulkConcepts';
import { FETCH_CIEL_CONCEPTS, IS_FETCHING } from '../../../redux/actions/types';

const initialState = { cielConcepts: [], loading: false };
describe('Test suite for vote reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should handle FETCH_CIEL_CONCEPTS', () => {
    expect(reducer(
      {},
      {
        type: FETCH_CIEL_CONCEPTS,
        payload: [],
      },
    )).toEqual({
      cielConcepts: [],
      loading: false,
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
      cielConcepts: [],
    });
  });
});
