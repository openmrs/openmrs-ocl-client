import { FETCH_CONCEPTS } from '../../../redux/actions/types';
import { isErrored, fetchConcepts } from '../../../redux/actions/concepts/ConceptActionCreators';

describe('Test for successful concept fetch', () => {
  const response = {
    data: {},
  };
  const responseData = {
    type: FETCH_CONCEPTS,
    payload: { data: {} },
  };

  it('should return action type and payload', () => {
    expect(fetchConcepts(response)).toEqual(responseData);
  });
  it('Test for errors while fetching concepts', () => {
    expect(isErrored(response)).toEqual(responseData);
  });
});
