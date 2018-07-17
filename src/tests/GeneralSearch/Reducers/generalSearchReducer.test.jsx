import reducer from '../../../redux/reducers/generalSearchReducer';
import { SEARCH_RESULTS, IS_FETCHING } from '../../../redux/actions/types';
import dictionaries from '../../__mocks__/dictionaries';

const initialState = { dictionaries: [], loading: false };
describe('Test suite for search result', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should handle SEARCH_RESULTS', () => {
    expect(reducer(
      { dictionaries: [] },
      {
        type: SEARCH_RESULTS,
        payload: [dictionaries],
      },
    )).toEqual({
      dictionaries: [dictionaries],
    });
  });
  it('should handle IS_FETCHING ', () => {
    expect(reducer(
      { loading: false },
      {
        type: IS_FETCHING,
        payload: true,
      },
    )).toEqual({
      loading: true,
    });
  });
});
