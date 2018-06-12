import { CLEAR_SOURCES } from '../../../redux/actions/types';
import { clearSources } from '../../../redux/actions/sources/sourcesActionCreators';

describe('Test for clearSources', () => {
  const response = {
    type: CLEAR_SOURCES,
    payload: [],
  };

  it('should return action type and payload', () => {
    expect(clearSources()).toEqual(response);
  });
});
