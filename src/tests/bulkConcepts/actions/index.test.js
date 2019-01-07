import moxios from 'moxios';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import instance from '../../../config/axiosConfig';
import { ADD_EXISTING_BULK_CONCEPTS } from '../../../redux/actions/types';
import { addExistingBulkConcepts, addDictionaryReference } from '../../../redux/actions/bulkConcepts';

const mockStore = configureStore([thunk]);
jest.mock('react-notify-toast');

describe('Test suite for ciel concepts actions', () => {
  beforeEach(() => {
    moxios.install(instance);
  });

  afterEach(() => {
    moxios.uninstall(instance);
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

  it('dispatches ADD_EXISTING_BULK_CONCEPTS  when adding dictionary reference', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: {
          data: [],
        },
      });
    });

    const expectedAction = [];

    const conceptUrl = '/orgs/WHO/sources/ICD-10/concepts/A15.2/';
    const ownerUrl = '/orgs/WHO/';
    const dictionaryId = 'ICD-10';
    const store = mockStore({});

    return store.dispatch(addDictionaryReference(conceptUrl, ownerUrl, dictionaryId))
      .then(() => expect(store.getActions()).toEqual(expectedAction));
  });
});
it('dispatches an error when adding bulk concepts', () => {
  moxios.wait(() => {
    const request = moxios.requests.mostRecent();
    request.reject({
      status: 400,
    });
  });
  const data = { expressions: ['/orgs/WHO/sources/ICD-10/concepts/A15.1/'] };
  const store = mockStore({});
  return store.dispatch(addExistingBulkConcepts(data))
    .catch(() => expect(store.getActions()).toEqual(returnedAction));
});
