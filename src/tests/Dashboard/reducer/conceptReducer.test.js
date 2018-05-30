import reducer from '../../../redux/reducers/ConceptReducers';
import { FETCH_CONCEPTS, IS_FETCHING } from '../../../redux/actions/types';

const initialState = { concepts: [], loading: false };
describe('Test suite for vote reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should handle FETCH_CONCEPTS', () => {
    expect(reducer(
      {},
      {
        type: FETCH_CONCEPTS,
        payload: [],
      },
    )).toEqual({
      concepts: [],
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
