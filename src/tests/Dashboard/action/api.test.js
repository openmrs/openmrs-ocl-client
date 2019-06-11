import moxios from 'moxios';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import instance from '../../../config/axiosConfig';
import { FETCHING_ORGANIZATIONS, ADDING_DICTIONARY } from '../../../redux/actions/types';
import {
  fetchingOrganizations, createDictionary, createDictionaryUser,
} from '../../../redux/actions/dictionaries/dictionaryActionCreators';
import organizations from '../../__mocks__/organizations';
import api from '../../../redux/api';
import { recursivelyFetchConceptMappings } from '../../../redux/actions/concepts/addBulkConcepts/index';

const mockStore = configureStore([thunk]);

jest.mock('react-notify-toast');

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

describe('Test suite for dictionary actions', () => {
  beforeEach(() => {
    moxios.install(instance);
  });

  afterEach(() => {
    moxios.uninstall(instance);
  });

  it('should dispatch ADD_DICTIONARY for organization', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: {
          data: {},
        }
      });
    });

    const expectedActions = [
      { type: ADDING_DICTIONARY, payload: {data: {}} },
    ];

    const store = mockStore({});

    const data = {
     conceptUrl: '/concept-url',
    }

    return store
      .dispatch(createDictionary(data))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should display an error for organization when trying to dispatch ADD_DICTIONARY when offline', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.reject({
        status: 599,
      });
    });

    const expectedActions = [];

    const store = mockStore({});

    const data = {
     conceptUrl: '/concept-url',
    }

    return store
      .dispatch(createDictionary(data))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should dispatch ADD_DICTIONARY error for organization', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 400,
        response: {
          __all__: [
            'could not create dictionary'
          ],
        }
      });
    });

    const expectedActions = [];

    const store = mockStore({});

    const data = {
     conceptUrl: '/concept-url',
    }

    return store
      .dispatch(createDictionary(data))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should dispatch ADD_DICTIONARY for user', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: {
          data: {},
        }
      });
    });

    const expectedActions = [
      { type: ADDING_DICTIONARY, payload: {data: {}} },
    ];

    const store = mockStore({});

    const data = {
     conceptUrl: '/concept-url',
    }

    return store
      .dispatch(createDictionaryUser(data))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should display an error for user when trying to dispatch ADD_DICTIONARY when offline', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.reject({
        status: 599,
      });
    });

    const expectedActions = [];

    const store = mockStore({});

    const data = {
     conceptUrl: '/concept-url',
    }

    return store
      .dispatch(createDictionaryUser(data))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should dispatch ADD_DICTIONARY error for user', () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 400,
        response: {
          __all__: [
            'could not create dictionary'
          ],
        }
      });
    });

    const expectedActions = [];

    const store = mockStore({});

    const data = {
     conceptUrl: '/concept-url',
    }

    return store
      .dispatch(createDictionaryUser(data))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });
});

describe('Test suite for Traditional OCL actions', () => {
  beforeEach(() => {
    moxios.install(instance);
  });

  afterEach(() => {
    moxios.uninstall(instance);
  });

  it('should call the mappings endpoint with the right parameters', async () => {
    const fromConcepts = '1,2,3';
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
      });
    });
    await api.mappings.fetchFromPublicSources(fromConcepts);
    const requestUrl = moxios.requests.__items[0].url;
    expect(requestUrl).toContain(`mappings/?fromConcept=${fromConcepts}`);
  })
});

describe('dictionaries', () => {
  describe('references', () => {
    describe('delete', () => {
      describe('fromACollection', () => {
        beforeEach(() => {
          moxios.install(instance);
        });

        afterEach(() => {
          moxios.uninstall(instance);
        });

        it('should call the deleteMappingsFromCollection endpoint with the right query and data', async () => {
          const collectionUrl = '/test/collection/url/';
          const references = ['/test/reference'];
          let requestUrl;
          let data;

          moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            requestUrl = request.url;
            data = request.config.data;
            request.respondWith({
              status: 200,
            });
          });

          await api.dictionaries.references.delete.fromACollection(collectionUrl, references);
          expect(requestUrl).toContain(`${collectionUrl}references/`);
          expect(data).toEqual(JSON.stringify({ references }));
        });
      });
    });
  });
});

describe('concepts', () => {
  describe('list', () => {
    describe('conceptsInASource', () => {
      beforeEach(() => {
        moxios.install(instance);
      });

      afterEach(() => {
        moxios.uninstall(instance);
      });

      it('should call the fetchConcepts endpoint with the right query', async ()=> {
        const url = '/test/url';
        const query = 'testQuery';
        let requestUrl;

        moxios.wait(() => {
          const request = moxios.requests.mostRecent();
          requestUrl = request.url;
          request.respondWith({
            status: 200,
          });
        });

        await api.concepts.list.conceptsInASource(url, query);
        expect(requestUrl).toContain(`${url}concepts/?limit=0&q=${query}*`);
      });

      it('should call the fetchConcepts endpoint with no query term if it is not provided', async ()=> {
        const url = '/test/url';
        const query = 'testQuery';
        let requestUrl;

        moxios.wait(() => {
          const request = moxios.requests.mostRecent();
          requestUrl = request.url;
          request.respondWith({
            status: 200,
          });
        });

        await api.concepts.list.conceptsInASource(url);
        expect(requestUrl).toContain(`${url}concepts/?limit=0&q=*`);
      });
    });
  });
});

describe('mappings', () => {
  describe('list', () => {
    describe('fromAConceptInACollection', () => {
      beforeEach(() => {
        moxios.install(instance);
      });

      afterEach(() => {
        moxios.uninstall(instance);
      });

      it('should call the fetchMappingsInCollection endpoint with the right query', async () => {
        const collectionUrl = '/test/collection/url/';
        const fromConceptCode = 1;
        let requestUrl;

        moxios.wait(() => {
          const request = moxios.requests.mostRecent();
          requestUrl = request.url;
          request.respondWith({
            status: 200,
          });
        });

        await api.mappings.list.fromAConceptInACollection(collectionUrl, fromConceptCode);
        expect(requestUrl)
          .toContain(`${collectionUrl}mappings/?limit=0&fromConcept=${fromConceptCode}`);
      });
    });
  });
});
