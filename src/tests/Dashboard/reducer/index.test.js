import reducer from '../../../redux/reducers/sourcesReducer';
import { FETCH_SOURCES, IS_FETCHING } from '../../../redux/actions/types';
import sources from '../../__mocks__/sources';

const initialState = { sources: [], loading: false, hasMore: false };
describe('Test suite for sources reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should handle FETCH_SOURCES', () => {
    expect(reducer(
      { sources: [] },
      {
        type: FETCH_SOURCES,
        payload: [sources],
      },
    )).toEqual({
      sources: [sources],
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
