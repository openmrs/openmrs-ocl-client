import { notify } from 'react-notify-toast';
import {
  addDictionary,
  fetchOrganizations,
  isSuccess,
  isFetching,
  dictionaryIsSuccess,
  isErrored,
  removeConcept,
  removeMapping,
  fetchingVersions,
  dictionaryConceptsIsSuccess,
  realisingHeadSuccess,
  editDictionarySuccess,
  creatingVersionsSuccess,
  creatingVersionsError,
} from './dictionaryActions';
import { filterPayload } from '../../reducers/util';
import { addDictionaryReference } from '../bulkConcepts';
import api from '../../api';

const showNetworkError = () => (
  notify.show('Network Error. Please try again later!', 'error', 6000));

/* eslint-disable */
export const createDictionary = data => async dispatch =>
  api.dictionaries
    .createDictionary(data)
    .then((payload) => {
      if (data.conceptUrl) {
        dispatch(addDictionaryReference(data.conceptUrl, payload.data.owner_url, payload.data.id));
      }
      dispatch(
        addDictionary(payload),
        notify.show(
          'Successfully added dictionary to your organization',
          'success', 6000,
        ),
      )})
    .catch(error =>
      notify.show(`${error.response.data.__all__[0]}`, 'error', 6000));

export const createDictionaryUser = data => dispatch =>
  api.dictionaries
    .createDictionaryUser(data)
    .then((payload) => {
      if (data.conceptUrl) {
        dispatch(addDictionaryReference(data.conceptUrl, payload.data.owner_url, payload.data.id));
      }
      dispatch(
        addDictionary(payload),
        notify.show(
          'Successfully added your dictionary',
          'success', 6000,
        ),
      )})
    .catch(error =>
      notify.show(`${error.response.data.__all__[0]}`, 'error', 6000));

export const fetchingOrganizations = () => dispatch =>
  api.organizations
    .fetchOrganizations()
    .then(payload => dispatch(fetchOrganizations(payload)));

export const fetchDictionaries = () => (dispatch) => {
  dispatch(isFetching(true));
  return api.dictionaries
    .fetchingDictionaries()
    .then((payload) => {
      const result = filterPayload(payload);
      dispatch(isSuccess(result));
      dispatch(isFetching(false));
    })
    .catch((error) => {
      error.response ? dispatch(isErrored(error.response.data)):
      showNetworkError();
      dispatch(isFetching(false));
    });
};

export const searchDictionaries = searchItem => (dispatch) => {
  dispatch(isFetching(true));
  return api.dictionaries
    .searchDictionaries(searchItem)
    .then((payload) => {
      dispatch(isSuccess(payload));
      dispatch(isFetching(false));
    })
    .catch(error => () => {
      dispatch(isErrored(error.payload.data));
      dispatch(isFetching(false));
    });
};

export const fetchDictionary = data => (dispatch) => {
  dispatch(isFetching(true));
  return api.dictionaries
    .fetchDictionary(data)
    .then(
      (payload) => {
      dispatch(dictionaryIsSuccess(payload));
      dispatch(isFetching(false));
    });
  };

export const removeDictionaryConcept = (data, type, owner, collectionId) => dispatch => {
  return api.dictionaries
    .removeDictionaryConcept(data, type, owner, collectionId)
    .then(
      (payload) => {
      dispatch(removeConcept(data.references[0]));
      notify.show(
        'Successfully removed a concept from my dictionary',
        'success', 1000
      );
    }
    )
    .catch(() => {
      notify.show("Network Error. Please try again later!", 'error', 6000)
      });
    };

export const removeConceptMapping = (data, source) => dispatch => {
  return api.dictionaries
    .removeConceptMapping(data)
    .then(
      () => {
        dispatch(removeMapping(data.references[0]));
        notify.show(
          'Successfully removed mapping from concept',
          'success', 1000
          );
        const ConceptsToFetch = `/users/${localStorage.getItem('username')}/sources/${localStorage.getItem('dictionaryId')}/concepts/?includeMappings=true&q=&limit=0&page=1&verbose=true`
          dispatch(fetchDictionaryConcepts(ConceptsToFetch));
      }
    )
    .catch((error) => {
      notify.show("Network Error. Please try again later!",'error', 6000)
    });
};

export const fetchVersions = data => (dispatch) => {
  return api.dictionaries
    .fetchingVersions(data)
    .then(
      (payload) => {
      dispatch(fetchingVersions(payload));
    })
    .catch(error => () => {
      notify.show(`${error.response.data.__all__[0]}`, 'error', 6000);
    });
  };

export const fetchDictionaryConcepts = data => (dispatch) => {
  dispatch(isFetching(true));
  return api.dictionaries
    .fetchDictionaryConcepts(data)
    .then(
      (payload) => {
      dispatch(dictionaryConceptsIsSuccess(payload));
      dispatch(isFetching(false));
      })
      .catch((error) => {
        error.response ? dispatch(isErrored(error.response.data)):
        showNetworkError();
        dispatch(isFetching(false));
      });
};

export const releaseHead = (url, data) => (dispatch) => {
  return api.dictionaries
    .realisingHeadVersion(url, data)
    .then(
      (payload) => {
        dispatch(realisingHeadSuccess(payload));
        dispatch(isFetching(false));
        notify.show(
          'Head Version Successfully Released',
          'success', 6000,
        );
      }
    )
    .catch(() => {
      dispatch(isFetching(false));
      notify.show("Network Error. Please try again later!", 'error', 6000);
      });
};
  export const editDictionary = (url, data) => dispatch => {
    return api.dictionaries
      .editDictionary(url, data)
      .then(payload => {
        notify.show(
          'Successfully updated dictionary',
          'success', 6000,
        );
        return dispatch(editDictionarySuccess(payload));
      })
      .catch(error => {
        notify.show(`${error.response.data.__all__[0]}`, 'error', 6000);
      })
};

export const editMapping = (url, data, source) => dispatch => {
  return api.dictionaries
    .editMappingCall(url, data)
    .then(() => {
      notify.show(
        'Mapping updated successfully.',
        'success', 6000,
      );
      const ConceptsToFetch = `/users/${localStorage.getItem('username')}/sources/${source}/concepts/?includeMappings=true&q=&limit=0&page=1&verbose=true`
      dispatch(fetchDictionaryConcepts(ConceptsToFetch));
    })
    .catch(error => {
      notify.show(error.response.data[0], 'error', 6000);
    })
};

export const createVersion = (url, data) => (dispatch) => {
  return api.dictionaries
    .creatingVersion(url, data)
    .then(
      (payload) => {
        dispatch(creatingVersionsSuccess(payload));
        dispatch(creatingVersionsError(false));
        notify.show(
          `${payload.id} has successfully been released`,
          'success', 6000,
        );
      })
    .catch((error) => {
      if(error.response.data.detail){
        dispatch(creatingVersionsError(true));
        notify.show(`${error.response.data.detail}`, 'error', 4000);
      }
      if(error.response.data.id){
        dispatch(creatingVersionsError(true));
        notify.show(`${error.response.data.id}`, 'error', 4000);
      } else {
        notify.show("Network Error. Please try again later!", 'error', 4000);
      }
    });
};

