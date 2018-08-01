import moxios from 'moxios';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import instance from '../../../config/axiosConfig';
import { IS_FETCHING, FETCH_BULK_CONCEPTS } from '../../../redux/actions/types';
import { fetchBulkConcepts } from '../../../redux/actions/concepts/addBulkConcepts';
import concepts from '../../__mocks__/concepts';

jest.mock('react-notify-toast');
const mockStore = configureStore([thunk]);

describe('Test suite for addBulkConcepts actions', () => {
  beforeEach(() => {
    moxios.install(instance);
  });

  afterEach(() => {
    moxios.uninstall(instance);
  });

  it('should handle FETCH_BULK_CONCEPTS', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: [concepts],
      });
    });

    const expectedActions = [
      { type: IS_FETCHING, payload: true },
      { type: FETCH_BULK_CONCEPTS, payload: [concepts] },
      { type: IS_FETCHING, payload: false },
    ];

    const store = mockStore({});

    return store.dispatch(fetchBulkConcepts()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('should handle error in FETCH_BULK_CONCEPTS', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 400,
        response: 'bad request',
      });
    });

    const expectedActions = [
      { type: IS_FETCHING, payload: true },
      { type: IS_FETCHING, payload: false },
    ];

    const store = mockStore({});

    return store.dispatch(fetchBulkConcepts()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
