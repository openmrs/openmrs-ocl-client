import moxios from 'moxios';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import instance from '../../../config/axiosConfig';
import {
  ADDING_DICTIONARY,
  FETCHING_DICTIONARIES,
  IS_FETCHING,
  CLEAR_DICTIONARIES,
  FETCHING_DICTIONARY,
  CLEAR_DICTIONARY,
  EDIT_DICTIONARY_SUCCESS,
  FETCHING_VERSIONS,
  FETCH_DICTIONARY_CONCEPT,
  FETCHING_ORGANIZATIONS,
  RELEASING_HEAD_VERSION,
  REMOVE_CONCEPT,
  CREATING_RELEASED_VERSION,
  CREATING_RELEASED_VERSION_FAILED, REPLACE_CONCEPT,
  TOGGLE_DICTIONARY_FETCHING,
} from '../../../redux/actions/types';
import {
  fetchOrganizations,
  addDictionary,
  clearDictionaries,
  isErrored,
  isSuccess,
  clearDictionary,
  removeConcept, replaceConcept,
} from '../../../redux/actions/dictionaries/dictionaryActions';
import {
  fetchDictionaries,
  searchDictionaries,
  fetchDictionary,
  fetchVersions,
  fetchDictionaryConcepts,
  releaseHead,
  editDictionary,
  createVersion,
  editMapping,
  retireConcept,
  addReferenceToCollectionAction,
  deleteReferenceFromCollectionAction,
  clearDictionariesAction,
} from '../../../redux/actions/dictionaries/dictionaryActionCreators';
import dictionaries, { sampleDictionaries } from '../../__mocks__/dictionaries';
import versions, { HeadVersion } from '../../__mocks__/versions';
import concepts, { sampleConcept, sampleRetiredConcept } from '../../__mocks__/concepts';
import { notify } from 'react-notify-toast';

jest.mock('react-notify-toast');

const mockStore = configureStore([thunk]);

describe('Test for successful organizations fetch', () => {
  const response = {
    data: {},
  };
  const responseData = {
    type: FETCHING_ORGANIZATIONS,
    payload: { data: {} },
  };
  const createDictionary = {
    type: ADDING_DICTIONARY,
    payload: {},
  };

  it('should return action type and payload', () => {
    expect(fetchOrganizations(response)).toEqual(responseData);
  });
  it('should return action type and payload after dictionary creation', () => {
    expect(addDictionary(response)).toEqual(createDictionary);
  });
});

describe('Test for successfully removing a Concept from a dictionary', () => {
  const response = '/url';

  const removeDictionaryConcept = {
    type: REMOVE_CONCEPT,
    payload: response,
  };

  it('should return action type and payload after removing a concept', () => {
    expect(removeConcept(response)).toEqual(removeDictionaryConcept);
  });
});

describe('replaceConcept', () => {
  it('should return action type and payload', () => {
    const expected = {
      type: REPLACE_CONCEPT,
      payload: concepts,
    };
    expect(replaceConcept(concepts)).toEqual(expected);
  });
});

describe('Test suite for dictionary actions', () => {
  beforeEach(() => {
    moxios.install(instance);
    localStorage.setItem('token', 'Token mytoken');
    localStorage.setItem('username', 'Dann');
  });
  const responseDict = {
    type: CLEAR_DICTIONARY,
    payload: {},
  };

  describe('clearDictionariesAction', () => {
    it('should dispatch the clearDictionaries action', () => {
      const dispatchMock = jest.fn();

      clearDictionariesAction()(dispatchMock);
      expect(dispatchMock).toHaveBeenCalledWith(clearDictionaries());
    });
  });

  it('should return an array of dictionaries', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: [dictionaries],
      });
    });

    const expectedActions = [
      { type: IS_FETCHING, payload: true },
      { type: FETCHING_DICTIONARIES, payload: [dictionaries] },
      { type: IS_FETCHING, payload: false },
    ];

    const store = mockStore({ payload: {} });

    return store.dispatch(
      fetchDictionaries('', 1000, 1, 'sortAsc=name', 'verbose=true'),
    ).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should handle fetch dictionaries network error', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.reject({
        status: 599,
      });
    });
    const expectedActions = [
      { payload: true, type: IS_FETCHING },
      { payload: false, type: IS_FETCHING },
    ];
    const store = mockStore({ payload: {} });
    return store.dispatch(fetchDictionaries('', 1000, 1, 'sortAsc=name', 'verbose=true')).then(() => {
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
      { type: FETCHING_DICTIONARIES, payload: 'could not complete this request' },
      { type: IS_FETCHING, payload: false },
    ];

    const store = mockStore({ payload: {} });

    return store.dispatch(
      fetchDictionaries('', 1000, 1, 'sortAsc=name', 'verbose=true'),
    ).then(() => {
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
      { type: TOGGLE_DICTIONARY_FETCHING, payload: true },
      { type: FETCHING_DICTIONARY, payload: [dictionaries] },
      { type: TOGGLE_DICTIONARY_FETCHING, payload: false },
    ];
    const store = mockStore({ payload: {} });
    return store.dispatch(fetchDictionary('/users/chriskala/collections/over/')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should alert a user and cancel the request if not logged in', () => {
    const notifyMock = jest.fn();
    notify.show = notifyMock;
    localStorage.clear();
    const store = mockStore({ payload: {} });
    return store.dispatch(fetchDictionary('/users/Dann/collections/over/')).catch((error) => {
      expect(error.message).toEqual('Request cancelled. Authentication required');
      expect(notifyMock).toHaveBeenCalledWith('Please log in first', 'warning', 3000);
      notifyMock.mockClear();
    });
  });

  it('should return concepts in a dictionary', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: [concepts],
      });
    });
    const expectedActions = [
      { type: IS_FETCHING, payload: true },
      { type: FETCH_DICTIONARY_CONCEPT, payload: [concepts] },
      { type: IS_FETCHING, payload: false },
    ];
    const store = mockStore({ payload: {} });
    return store.dispatch(
      fetchDictionaryConcepts('/users/chriskala/collections/over/'),
    ).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should handle fetch dictionary concepts network error', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.reject({
        status: 599,
      });
    });
    const expectedActions = [
      { payload: true, type: IS_FETCHING },
      { payload: false, type: IS_FETCHING },
    ];
    const store = mockStore({ payload: {} });
    return store.dispatch(fetchDictionaryConcepts('/users/chriskala/collections/over/')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should handle edit mapping and fail', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.reject({
        status: 400,
        response: {
          data: ['Cannot map concept to itself'],
        },
      });
    });
    const expectedActions = [];

    const MappingToEdit = {
      map_type: 'Same As',
      from_concept_url: '/users/chriskala/sources/85873898755537984747/concepts/3ebaa575-52e5-4d93-90e7-bc13a1ae4c9e/',
      to_concept_url: '/users/chriskala/sources/85873898755537984747/concepts/01034897-766c-487e-97ec-075e5197f6e8/',
    };

    const store = mockStore({ payload: {} });
    return store.dispatch(editMapping('/users/chriskala/sources/858738987555379984/mappings/5bfeac11bdfb8801a1702953/', MappingToEdit, '6346536456354635')).catch(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should handle edit mapping and pass', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: [],
      });
    });
    const expectedActions = [
      { payload: true, type: '[ui] toggle spinner' },
    ];
    const store = mockStore({ payload: {} });

    const MappingToEdit = {
      map_type: 'Same As',
      from_concept_url: '/users/chriskala/sources/85873898755537984747/concepts/3ebaa575-52e5-4d93-90e7-bc13a1ae4c9e/',
      to_concept_url: '/users/chriskala/sources/85873898755537984747/concepts/01034897-766c-487e-97ec-075e5197f6e8/',
    };

    return store.dispatch(
      editMapping('/users/chriskala/sources/858738987555379984/mappings/5bfeac11bdfb8801a1702953/', MappingToEdit, '858738987555379984'),
    ).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should return an array of dictionaries on search', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: sampleDictionaries,
      });
    });

    const expectedActions = [
      { type: IS_FETCHING, payload: true },
      { type: FETCHING_DICTIONARIES, payload: sampleDictionaries },
      { type: IS_FETCHING, payload: false },
    ];

    const store = mockStore({ payload: {} });
    return store.dispatch(
      searchDictionaries('', 1000, 1, 'sortAsc=name', 'verbose=true'),
    ).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should return an error message from the db in case of a failed search', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 400,
        response: 'could not complete this request',
      });
    });
    const expectedActions = [
      { type: IS_FETCHING, payload: true },
      { type: IS_FETCHING, payload: false },
      { type: '[dictionaries] fetch dictionaries', payload: 'could not complete this request' },
    ];
    const store = mockStore({ payload: {} });
    return store.dispatch(
      searchDictionaries('', 1000, 1, 'sortAsc=name', 'verbose=true'),
    ).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('should return a network error message if failed search', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.reject({
        status: 599,
      });
    });
    const expectedActions = [
      { payload: true, type: IS_FETCHING },
      { payload: false, type: IS_FETCHING },
    ];
    const store = mockStore({ payload: {} });
    return store.dispatch(
      searchDictionaries('', 1000, 1, 'sortAsc=name', 'verbose=true'),
    ).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('should return action type and payload', () => {
    expect(clearDictionary()).toEqual(responseDict);
  });

  it('should return action type and payload', () => {
    expect(clearDictionary()).toEqual(responseDict);
  });

  it('should dispatch EDIT_DICTIONARY_SUCCESS on success response', () => {
    const dictionary = dictionaries;
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: dictionary,
      });
    });
    const expectedActions = [
      { type: EDIT_DICTIONARY_SUCCESS, payload: dictionary },
    ];
    const store = mockStore({ payload: {} });
    return store.dispatch(editDictionary('/dictionary-url', dictionary)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('should dispatch nothing on edit dictionary failure response', () => {
    const dictionary = dictionaries;
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.reject({
        status: 400,
        response: {
          data: {
            __all__: ['Bad Request'],
          },
        },
      });
    });
    const expectedActions = [];
    const store = mockStore({ payload: {} });
    return store.dispatch(editDictionary('/dictionary-url', dictionary)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should display error message when offline', () => {
    const dictionary = dictionaries;
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.reject({
        status: 599,
      });
    });
    const expectedActions = [];
    const store = mockStore({ payload: {} });
    return store.dispatch(editDictionary('/dictionary-url', dictionary)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should retire a concept when the retireConcept action is triggered with the true argument', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: sampleRetiredConcept,
      });
    });
    const store = mockStore({ payload: {} });
    return store.dispatch(retireConcept(sampleConcept.url, { retired: true })).then((result) => {
      expect(result.retired).toEqual(true);
    });
  });

  it('should unretire a concept when the retireConcept action is triggered with the false argument', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: sampleConcept,
      });
    });
    const store = mockStore({ payload: {} });
    return store.dispatch(retireConcept(sampleConcept.url, { retired: false })).then((result) => {
      expect(result.retired).toEqual(false);
    });
  });

  it('should handle retire/unretire errors', () => {
    const message = 'Sample Error message';
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.reject({
        status: 400,
        response: { data: message },
      });
    });
    const store = mockStore({ payload: {} });
    return store.dispatch(retireConcept(sampleConcept.url, { retired: false })).then(() => {
      expect(store.getActions()).toEqual([{ type: FETCHING_DICTIONARIES, payload: message }]);
    });
  });
});

describe('Test for successful dictionaries fetch, failure and refresh', () => {
  const response = {
    data: {},
  };
  const clearDictionariesData = {
    type: CLEAR_DICTIONARIES,
    payload: [],
  };
  const responseData = {
    type: FETCHING_DICTIONARIES,
    payload: { data: {} },
  };

  it('should clear payload when clearDictionaries is called', () => {
    expect(clearDictionaries(response)).toEqual(clearDictionariesData);
  });

  it('should show errors when isErrored is called', () => {
    expect(isErrored(response)).toEqual(responseData);
    expect(isErrored(response)).toBeTruthy();
  });

  it('should show data when isSuccess is called', () => {
    expect(isSuccess(response)).toEqual(responseData);
    expect(isSuccess(response)).toBeTruthy();
  });

  it('should return a dictionary version', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: [versions],
      });
    });
    const expectedActions = [
      { type: FETCHING_VERSIONS, payload: [versions] },
    ];
    const store = mockStore({ payload: {} });
    return store.dispatch(fetchVersions('/users/chriskala/collections/over/versions/')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should handle failed a dictionary fetching', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 500,
        response: {
          data: 'Error Occurred',
        },
      });
    });
    const store = mockStore({ payload: {} });
    return store.dispatch(fetchVersions('/users/chriskala/collections/over/versions/'))
      .then()
      .catch((error) => {
        expect(notify.show).toHaveBeenCalledWith(
          `${error.response.data[0]}`, 'error', 6000,
        );
      });
  });

  it('should handle release head version', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: [HeadVersion],
      });
    });
    const expectedActions = [
      {
        type: RELEASING_HEAD_VERSION, payload: [HeadVersion],
      },
      {
        payload: false, type: '[ui] toggle spinner',
      },
    ];
    const store = mockStore({ payload: {} });
    return store.dispatch(releaseHead('/users/nesh/collections/test/1.0/')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should handle release version network error', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.reject({
        status: 599,
      });
    });
    const expectedActions = [
      {
        payload: false, type: '[ui] toggle spinner',
      },
    ];
    const store = mockStore({ payload: {} });
    return store.dispatch(releaseHead('/users/nesh/collections/test/1.0/')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should handle release of an existing version Id', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.reject({
        status: 409,
        response: {
          data: {
            detail: 'V2.5 already exists',
          },
        },
      });
    });
    const expectedActions = [
      {
        type: CREATING_RELEASED_VERSION_FAILED,
        payload: true,
      },
    ];
    const store = mockStore({ payload: {} });
    const data = {
      id: '2.5',
      released: true,
      description: 'Released',
    };
    const url = '/users/nesh/collections/test/1.0/';
    return store.dispatch(createVersion(url, data)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should handle release of a missing Id', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.reject({
        status: 409,
        response: {
          data: {
            id: 'id cannot be missing',
          },
        },
      });
    });
    const expectedActions = [
      {
        type: CREATING_RELEASED_VERSION_FAILED,
        payload: true,
      },
    ];
    const store = mockStore({ payload: {} });
    const data = {
      released: true,
      description: 'Released',
    };
    const url = '/users/nesh/collections/test/1.0/';
    return store.dispatch(createVersion(url, data)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should handle release of a new version', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 201,
        response: {
          versions,
        },
      });
    });
    const expectedActions = [
      {
        type: CREATING_RELEASED_VERSION,
        payload: {
          versions,
        },
      },
      {
        type: CREATING_RELEASED_VERSION_FAILED,
        payload: false,
      },
    ];
    const store = mockStore({ payload: {} });
    const data = {
      released: true,
      description: 'Released',
    };
    const url = '/users/nesh/collections/test/1.0/';
    return store.dispatch(createVersion(url, data)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('addReferenceToCollectionAction', () => {
    beforeEach(() => {
      moxios.install(instance);
    });

    afterEach(() => {
      moxios.uninstall(instance);
    });

    it('should return the right data on success', async () => {
      const expectedData = 'data';
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: { expectedData },
        });
      });

      const result = await addReferenceToCollectionAction()();
      expect(result.data).toEqual({ expectedData });
    });

    it('should return false and display an error on an unknown failure', async () => {
      const notifyMock = jest.fn();
      notify.show = notifyMock;
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.reject();
      });

      const result = await addReferenceToCollectionAction()();
      expect(result).toBeFalsy();
      expect(notifyMock).toHaveBeenCalledWith('Failed to update the concept in this collection', 'error', 3000);
    });

    it('should return false and display the error on failure', async () => {
      const message = 'Failed';
      const notifyMock = jest.fn();
      notify.show = notifyMock;
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.reject({ response: { data: message } });
      });

      const result = await addReferenceToCollectionAction()();
      expect(result).toBeFalsy();
      expect(notifyMock).toHaveBeenCalledWith(message, 'error', 3000);
    });
  });

  describe('deleteReferenceFromCollectionAction', () => {
    beforeEach(() => {
      moxios.install(instance);
    });

    afterEach(() => {
      moxios.uninstall(instance);
    });

    it('should return the right data on success', async () => {
      const expectedData = 'data';
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: { expectedData },
        });
      });

      const result = await deleteReferenceFromCollectionAction()();
      expect(result.data).toEqual({ expectedData });
    });

    it('should return false and display an error on an unknown failure', async () => {
      const notifyMock = jest.fn();
      notify.show = notifyMock;
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.reject();
      });

      const result = await deleteReferenceFromCollectionAction()();
      expect(result).toBeFalsy();
      expect(notifyMock).toHaveBeenCalledWith('Failed to update the concept in this collection. Please Retry', 'error', 3000);
    });

    it('should return false and display the error failure', async () => {
      const message = 'Failed';
      const notifyMock = jest.fn();
      notify.show = notifyMock;
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.reject({ response: { data: message } });
      });

      const result = await deleteReferenceFromCollectionAction()();
      expect(result).toBeFalsy();
      expect(notifyMock).toHaveBeenCalledWith(message, 'error', 3000);
    });
  });
});
