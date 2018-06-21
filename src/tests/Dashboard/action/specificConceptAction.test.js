import moxios from 'moxios';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import instance from '../../../config/axiosConfig';
import { FETCH_CONCEPTS, IS_FETCHING } from '../../../redux/actions/types';
import fetchConceptsActionTypes from '../../../redux/actions/concepts/specificConceptAction';
import concepts from '../../__mocks__/concepts';

const mockStore = configureStore([thunk]);

describe('Test suite for specific concepts actions', () => {
  beforeEach(() => {
    moxios.install(instance);
  });

  afterEach(() => {
    moxios.uninstall(instance);
  });

  it('should return an array of concepts', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: [concepts],
      });
    });

    const expectedActions = [
      { type: IS_FETCHING, payload: true },
      { type: FETCH_CONCEPTS, payload: [concepts] },
      { type: IS_FETCHING, payload: false },
    ];

    const store = mockStore({ payload: {} });

    return store.dispatch(fetchConceptsActionTypes('malaria', 10, 1)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
