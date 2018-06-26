import moxios from 'moxios';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import instance from '../../../config/axiosConfig';
import { FETCHING_ORGANIZATIONS } from '../../../redux/actions/types';
import { fetchingOrganizations } from '../../../redux/actions/dictionaries/dictionaryActionCreators';
import organizations from '../../__mocks__/organizations';

const mockStore = configureStore([thunk]);

describe('Test suite for organization actions', () => {
  beforeEach(() => {
    moxios.install(instance);
  });

  afterEach(() => {
    moxios.uninstall(instance);
  });

  /* eslint-disable */
  it('should return an array of organizations', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: [organizations],
      });
    });

    const expectedActions = [
      { type: FETCHING_ORGANIZATIONS, payload: [organizations] },
    ];

    const store = mockStore({ payload: {} });
    return store
      .dispatch(fetchingOrganizations('ocl', ['Dictionary'], 10, 1, 'sortAsc=name'))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });
});
