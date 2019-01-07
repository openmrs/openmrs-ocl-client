import reducer from '../../../redux/reducers/bulkConcepts';
import { IS_FETCHING } from '../../../redux/actions/types';

const initialState = { cielConcepts: [], loading: false };
describe('Test suite for vote reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
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
