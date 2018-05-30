import reducer from '../../../redux/reducers/sourcesReducer';
import { FETCH_SOURCES, IS_FETCHING } from '../../../redux/actions/types';

const initialState = { sources: [], loading: false };
describe('Test suite for vote reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should handle FETCH_SOURCES', () => {
    expect(reducer(
      {},
      {
        type: FETCH_SOURCES,
        payload: [],
      },
    )).toEqual({
      sources: [],
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
