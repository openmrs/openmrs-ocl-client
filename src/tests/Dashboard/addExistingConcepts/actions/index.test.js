import moxios from 'moxios';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import instance from '../../../../config/axiosConfig';
import { ADD_EXISTING_CONCEPTS } from '../../../../redux/actions/types';
import addExistingConceptsAction from '../../../../redux/actions/concepts/addExistingConcepts/index';

const mockStore = configureStore([thunk]);
jest.mock('react-notify-toast');

describe('Test suite for sources actions', () => {
  beforeEach(() => {
    moxios.install(instance);
  });

  afterEach(() => {
    moxios.uninstall(instance);
  });
  it('dispatches ADD_EXISTING_CONCEPTS  action type on respose from server', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: [{ data: { data: [{ added: true }] } }],
      });
    });

    const returnedAction = [{
      type: ADD_EXISTING_CONCEPTS,
      payload: [{ data: { data: [{ added: true }] } }],
    }];
    const data = { expressions: ['/orgs/WHO/sources/ICD-10/concepts/A15.1/'] };
    const store = mockStore({});
    return store.dispatch(addExistingConceptsAction(data))
      .then(() => expect(store.getActions()).toEqual(returnedAction));
  });
  it('should return a success message after adding concepts', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: [{ added: true }],
      });
    });

    const expectedActions = [
      {
        type: ADD_EXISTING_CONCEPTS,
        payload: [{ added: true }],
      },
    ];
    const data = { expressions: ['/orgs/WHO/sources/ICD-10/concepts/A15.1/'] };
    const store = mockStore({});

    return store.dispatch(addExistingConceptsAction(data)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('should return an error message from the db when add an already added concept', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: [{ added: false }],
      });
    });

    const expectedActions = [
      {
        type: ADD_EXISTING_CONCEPTS,
        payload: [{ added: false }],
      },
    ];
    const data = { expressions: ['/orgs/WHO/sources/ICD-10/concepts/A15.1/'] };
    const store = mockStore({});

    return store.dispatch(addExistingConceptsAction(data)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});

