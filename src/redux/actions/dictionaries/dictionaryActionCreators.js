import { notify } from 'react-notify-toast';
import {
  addDictionary,
  fetchOrganizations,
  isSuccess,
  isFetching,
  dictionaryIsSuccess,
  removeConcept,
  removeMapping,
  fetchingVersions,
  dictionaryConceptsIsSuccess,
  realisingHeadSuccess,
  editDictionarySuccess,
  creatingVersionsSuccess,
  creatingVersionsError,
  replaceConcept,
  toggleDictionaryFetching,
  clearDictionaries,
} from './dictionaryActions';
import { filterPayload } from '../../reducers/util';
import { addDictionaryReference } from '../bulkConcepts';
import api from '../../api';
import { checkErrorMessage } from '../../../helperFunctions';
import axiosInstance from '../../../config/axiosConfig';

export const showNetworkError = () => (
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
    .catch(error => {
      error.response ? notify.show(`${error.response.data.__all__[0]}`, 'error', 6000):
      showNetworkError();
    });

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
    .catch(error => {
      error.response ? notify.show(`${error.response.data.__all__[0]}`, 'error', 6000) :
      showNetworkError();
    });

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
      const defaultMessage = 'Could not retrieve the dictionaries';
      checkErrorMessage(error, defaultMessage);
      showNetworkError();
      dispatch(isFetching(false));
    });
};

export const searchDictionaries = searchItem => async (dispatch) => {
  dispatch(isFetching(true));
  try {
    const payload = await api.dictionaries
      .searchDictionaries(searchItem);
    const result = filterPayload(payload);
    dispatch(isSuccess(result));
    dispatch(isFetching(false));
  }
  catch (error) {
    dispatch(isFetching(false));
    const defaultMessage = 'Could not retrieve the dictionaries';
    checkErrorMessage(error, defaultMessage);
  }
};

export const clearDictionariesAction = () => (dispatch) => {
  dispatch(clearDictionaries());
};

export const fetchDictionary = data => (dispatch) => {
  dispatch(toggleDictionaryFetching(true));
  return api.dictionaries
    .fetchDictionary(data)
    .then(
      (payload) => {
      dispatch(dictionaryIsSuccess(payload));
      dispatch(toggleDictionaryFetching(false));
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
    .catch((error) => {
      error.response ? notify.show(error.response.data.detail, 'error', 6000):
      showNetworkError();
      });
    };

// todo picking the source from localStorage is not good and is
//  only here until we are sure no other part of the code depends on it
export const removeConceptMapping = (data, ownerType, owner, source=localStorage.getItem('dictionaryId')) => dispatch => {
  return api.dictionaries
    .removeConceptMapping(data)
    .then(
      () => {
        dispatch(removeMapping(data.references[0]));
        notify.show(
          'Successfully removed mapping from concept',
          'success', 1000
          );
        const ConceptsToFetch = `/${ownerType}/${owner}/sources/${source}/concepts/?includeMappings=true&q=&limit=0&page=1&verbose=true`;
          dispatch(fetchDictionaryConcepts(ConceptsToFetch));
      }
    )
    .catch((error) => {
      error.response ? notify.show(error.response.data.detail, 'error', 6000):
      showNetworkError();
    });
};

export const removeEditedConceptMapping = (data) => dispatch =>
  api.dictionaries
    .removeConceptMapping(data)
    .then(
      () => {
        dispatch(removeMapping(data.references[0]));
      }
    )
    .catch((error) => {
      error.response ? notify.show(error.response.data.detail, 'error', 6000):
      showNetworkError();
    });

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
        if (error && error.response) {
          notify.show('Could not retrieve dictionary concept', 'error', 3000);
        } else {
          showNetworkError();
        }
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
  export const editDictionary = (url, data) => async dispatch => {
    const editSource = async (url, data) =>  {
      try {
        await api.sources.edit(url, data);
        return true;
      } catch (error) {
        notify.hide();
        notify.show('An error occurred while updating the source. Please retry', 'error', 3000);
        return false;
      }
    };
    try {
      const updateSourceResult = await editSource(url.replace('collections', 'sources', data));
      if (!updateSourceResult) {
        return
      }

      const payload =  await api.dictionaries.editDictionary(url, data);
      notify.show(
        'Successfully updated dictionary',
        'success', 6000,
      );
      return dispatch(editDictionarySuccess(payload));
    } catch (error) {
      error.response ? notify.show(`${error.response.data.__all__[0]}`, 'error', 6000) :
        showNetworkError();
    }
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
        dispatch(fetchVersions(url));
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

export const retireConcept = (conceptUrl, retire) => async (dispatch) => {
  const retiredMessage = retire ? 'retired' : 'un-retired';
  const retiringMessage = retire ? 'Retiring' : 'Un-Retiring';
  notify.show(retiringMessage, 'warning', 2000);
  try {
    const response = await api.concepts.retireConcept(conceptUrl, retire);
    dispatch(replaceConcept(response.data));
    notify.show(`Concept successfully ${retiredMessage}`, 'success', 3000);
    return response.data;
  } catch (error) {
    notify.show(`Failed to ${retiredMessage} the concept`, 'error', 3000);
    return null;
  }
}

export const addReferenceToCollectionAction = (type, owner, collection, expressions, cascadeMappings = true) => async (dispatch) => {
  try {
    return await api.dictionaries.addReferencesToCollection(type, owner, collection, expressions, cascadeMappings);
  } catch (e) {
    if(e && e.response && e.response.data){
      notify.show(e.response.data, 'error', 3000);
    }
    else{
      notify.show('Failed to update the concept in this collection', 'error', 3000);
    }
    return false;
  }
};

export const deleteReferenceFromCollectionAction = (type, owner, collection, references) => async (dispatch) => {
  try {
    return await api.dictionaries.deleteReferenceFromCollection(type, owner, collection, references);
  } catch (e) {
    if(e && e.response && e.response.data){
      notify.show(e.response.data, 'error', 3000);
    }
    else{
      notify.show('Failed to update the concept in this collection. Please Retry', 'error', 3000);
    }
    return false;
  }
};
