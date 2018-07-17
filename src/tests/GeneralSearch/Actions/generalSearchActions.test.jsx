import moxios from 'moxios';
import configure from 'redux-mock-store';
import thunk from 'redux-thunk';

import instance from '../../../config/axiosConfig';
import { IS_FETCHING, SEARCH_RESULTS } from '../../../redux/actions/types';
import generalsearch from '../../../redux/actions/GeneralSearchActions/generalSearchActionCreators';
import dictionaries from '../../__mocks__/dictionaries';

const mockstore = configure([thunk]);

describe('Test suite for Search Results actions', () => {
  beforeEach(() => {
    moxios.install(instance);
  });

  afterEach(() => {
    moxios.uninstall(instance);
  });

  it('should return a dictionary', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: [dictionaries],
      });
    });
    const expectedActions = [
      { type: IS_FETCHING, payload: true },
      { type: SEARCH_RESULTS, payload: [dictionaries] },
      { type: IS_FETCHING, payload: false },
    ];
    const store = mockstore({
      payload: {},
    });

    return store.dispatch(generalsearch('ChrisMain4567')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('should return a dictionary', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: [dictionaries],
      });
    });
    const expectedActions = [
      { type: IS_FETCHING, payload: true },
      { type: SEARCH_RESULTS, payload: [dictionaries] },
      { type: IS_FETCHING, payload: false },
    ];
    const store = mockstore({
      payload: {},
    });
    return store.dispatch(generalsearch()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
