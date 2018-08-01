import moxios from 'moxios';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import instance from '../../../config/axiosConfig';
import { FETCH_CIEL_CONCEPTS, IS_FETCHING, ADD_EXISTING_BULK_CONCEPTS } from '../../../redux/actions/types';
import fetchCielConcepts, { addExistingBulkConcepts } from '../../../redux/actions/bulkConcepts';
import cielConcepts from '../../__mocks__/concepts';

const mockStore = configureStore([thunk]);
jest.mock('react-notify-toast');

describe('Test suite for ciel concepts actions', () => {
  beforeEach(() => {
    moxios.install(instance);
  });

  afterEach(() => {
    moxios.uninstall(instance);
  });

  it('should return an array of ciel concepts', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: [{ cielConcepts: { cielConcepts } }],
      });
    });

    const expectedActions = [
      { type: IS_FETCHING, payload: true },
      { type: FETCH_CIEL_CONCEPTS, payload: [{ cielConcepts: { cielConcepts } }] },
      { type: IS_FETCHING, payload: false },
    ];

    const store = mockStore({ });

    return store.dispatch(fetchCielConcepts()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('dispatches FETCH_CIEL_CONCEPTS  action type on respose from server', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: [{ cielConcepts: { cielConcepts } }],
      });
    });

    const returnedAction = [
      { type: IS_FETCHING, payload: true },
      { type: FETCH_CIEL_CONCEPTS, payload: [{ cielConcepts: { cielConcepts } }] },
      { type: IS_FETCHING, payload: false },
    ];
    const store = mockStore({});
    return store.dispatch(fetchCielConcepts())
      .then(() => expect(store.getActions()).toEqual(returnedAction));
  });
  it('dispatches ADD_EXISTING_BULK_CONCEPTS  action type on respose from server', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: [{ data: { data: [{ added: true }] } }],
      });
    });

    const returnedAction = [{
      type: ADD_EXISTING_BULK_CONCEPTS,
      payload: [{ data: { data: [{ added: true }] } }],
    }];
    const data = { expressions: ['/orgs/WHO/sources/ICD-10/concepts/A15.1/'] };
    const store = mockStore({});
    return store.dispatch(addExistingBulkConcepts(data))
      .then(() => expect(store.getActions()).toEqual(returnedAction));
  });
  it('dispatches an error message when a response is errored', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 400,
        response: 'could not complete this request',
      });
    });

    const returnedAction = [
      { type: IS_FETCHING, payload: true },
      { type: FETCH_CIEL_CONCEPTS, payload: 'could not complete this request' },
      { type: IS_FETCHING, payload: false },
    ];
    const store = mockStore({});
    return store.dispatch(fetchCielConcepts())
      .then(() => expect(store.getActions()).toEqual(returnedAction));
  });
});
