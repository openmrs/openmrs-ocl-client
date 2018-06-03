import { FETCH_SOURCES } from '../../../redux/actions/types';
import { isErrored, isSuccess } from '../../../redux/actions/sources/sourcesActionCreators';

describe('Test for successful sources fetch', () => {
  const response = {
    data: {},
  };
  const responseData = {
    type: FETCH_SOURCES,
    payload: { data: {} },
  };

  it('should return action type and payload', () => {
    expect(isSuccess(response)).toEqual(responseData);
  });
  it('Test for errors while fetching sources', () => {
    expect(isErrored(response)).toEqual(responseData);
  });
});
