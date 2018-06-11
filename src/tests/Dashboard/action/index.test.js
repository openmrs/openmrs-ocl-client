import moxios from 'moxios';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import instance from '../../../config/axiosConfig';
import { IS_FETCHING, SEARCH_SOURCES } from '../../../redux/actions/types';
import { fetchSources } from '../../../redux/actions/sources';
import sources from '../../__mocks__/sources';

const mockStore = configureStore([thunk]);

describe('Test suite for sources actions', () => {
  beforeEach(() => {
    moxios.install(instance);
  });

  afterEach(() => {
    moxios.uninstall(instance);
  });

  it('should return an array of sources', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: [sources],
      });
    });

    const expectedActions = [
      { type: IS_FETCHING, payload: true },
      { type: SEARCH_SOURCES, payload: [sources] },
      { type: IS_FETCHING, payload: false },
    ];

    const store = mockStore({ payload: {} });

    return store.dispatch(fetchSources('ciel', ['Dictionary'], 10, 1, 'sortAsc=name')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should return an error message from the db', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 400,
        response: 'could not complete this request',
      });
    });

    const expectedActions = [
      { type: IS_FETCHING, payload: true },
      { type: SEARCH_SOURCES, payload: 'could not complete this request' },
      { type: IS_FETCHING, payload: false },
    ];

    const store = mockStore({ payload: {} });

    return store.dispatch(fetchSources('ciel', ['Dictionary'], 10, 1, 'sortAsc=name')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
