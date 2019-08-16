import uuid from 'uuid/v4';
import { notify } from 'react-notify-toast';
import axios from 'axios';
import { showNetworkError } from '../dictionaries/dictionaryActionCreators';
import {
  INTERNAL_MAPPING_DEFAULT_SOURCE,
  MAP_TYPE,
  isExternalSource,
  removeBlankMappings, removeBlankSetsOrAnswers,
} from '../../../components/dictionaryConcepts/components/helperFunction';

import {
  FILTER_BY_SOURCES,
  FILTER_BY_CLASS,
  FETCH_DICTIONARY_CONCEPT,
  CREATE_NEW_NAMES,
  REMOVE_ONE_NAME,
  ADD_NEW_DESCRIPTION,
  REMOVE_ONE_DESCRIPTION,
  CLEAR_FORM_SELECTIONS,
  CREATE_NEW_CONCEPT,
  ADD_CONCEPT_TO_DICTIONARY,
  FETCH_EXISTING_CONCEPT,
  FETCH_EXISTING_CONCEPT_ERROR,
  UPDATE_CONCEPT,
  EDIT_CONCEPT_ADD_DESCRIPTION,
  EDIT_CONCEPT_REMOVE_ONE_DESCRIPTION,
  CLEAR_PREVIOUS_CONCEPT,
  EDIT_CONCEPT_CREATE_NEW_NAMES,
  EDIT_CONCEPT_REMOVE_ONE_NAME,
  ADD_SELECTED_ANSWERS,
  REMOVE_SELECTED_ANSWER,
  PRE_POPULATE_ANSWERS,
  UNPOPULATE_PRE_POPULATED_ANSWERS,
  ADD_NEW_ANSWER_ROW,
  UN_POPULATE_THIS_ANSWER,
  ADD_NEW_SET_ROW,
  REMOVE_SELECTED_SET,
  ADD_SELECTED_SETS,
  PRE_POPULATE_SETS,
  UNPOPULATE_PRE_POPULATED_SETS,
  UNPOPULATE_SET, CLEAR_FILTERS,
} from '../types';
import {
  isFetching,
  getDictionaryConcepts,
  isErrored,
  isSuccess,
} from '../globalActionCreators/index';

import instance from '../../../config/axiosConfig';
import api from '../../api';
import { recursivelyFetchConceptMappings } from './addBulkConcepts';
import { buildPartialSearchQuery } from '../../../helperFunctions';

export const createNewName = () => (dispatch) => {
  const payload = uuid();
  dispatch({ type: CREATE_NEW_NAMES, payload });
};

export const removeNewName = id => (dispatch) => {
  const payload = id;
  dispatch({ type: REMOVE_ONE_NAME, payload });
};

export const addNewDescription = () => (dispatch) => {
  const payload = uuid();
  dispatch({ type: ADD_NEW_DESCRIPTION, payload });
};

export const removeDescription = id => (dispatch) => {
  const payload = id;
  dispatch({ type: REMOVE_ONE_DESCRIPTION, payload });
};

export const createNewNameForEditConcept = () => (dispatch) => {
  const payload = uuid();
  dispatch({ type: EDIT_CONCEPT_CREATE_NEW_NAMES, payload });
};

export const removeNameForEditConcept = id => (dispatch) => {
  const payload = id;
  dispatch({ type: EDIT_CONCEPT_REMOVE_ONE_NAME, payload });
};

export const addDescriptionForEditConcept = () => (dispatch) => {
  const payload = uuid();
  dispatch({ type: EDIT_CONCEPT_ADD_DESCRIPTION, payload });
};

export const removeDescriptionForEditConcept = id => (dispatch) => {
  const payload = id;
  dispatch({ type: EDIT_CONCEPT_REMOVE_ONE_DESCRIPTION, payload });
};

export const clearSelections = () => (dispatch) => {
  dispatch({ type: CLEAR_FORM_SELECTIONS, payload: [] });
};

export const fetchDictionaryConcepts = (
  conceptType = 'users',
  conceptOwner = 'emasys',
  conceptName = 'dev-col',
  query = '*',
  limit = 0,
  page = 1,
) => async (dispatch, getState) => {
  dispatch(isFetching(true));

  const searchQuery = buildPartialSearchQuery(query);
  let url = `${conceptType}/${conceptOwner}/collections/${conceptName}/concepts/?q=${searchQuery}&limit=${limit}&page=${page}&verbose=true&includeMappings=1&sortDesc=lastUpdate`;
  const filterBySource = getState().concepts.filteredBySource;
  const filterByClass = getState().concepts.filteredByClass;

  if (filterBySource.length > 0) {
    url = `${url}&source=${filterBySource.join(',')}`;
  }

  if (filterByClass.length > 0) {
    url = `${url}&conceptClass=${filterByClass.join(',')}`;
  }
  try {
    const response = await instance.get(`${url}&includeRetired=1`);
    // this filter is to account for situations where a ref to a concept
    // version is not removed after an update. Pending backend fix.
    // ticket: https://github.com/OpenConceptLab/ocl_issues/issues/115
    const concepts = response.data.filter(
      concept => concept.is_latest_version,
    );
    dispatch(getDictionaryConcepts(concepts, FETCH_DICTIONARY_CONCEPT));
  } catch (error) {
    if (error.response && error.response.data && error.response.data.detail) {
      notify.show(error.response.data.detail, 'error', 3000);
    } else {
      showNetworkError();
    }
    dispatch(getDictionaryConcepts([], FETCH_DICTIONARY_CONCEPT));
  }
  dispatch(isFetching(false));
};

export const filterBySource = keyword => (dispatch) => {
  dispatch({ type: FILTER_BY_SOURCES, payload: keyword });
};

export const filterByClass = keyword => (dispatch) => {
  dispatch({ type: FILTER_BY_CLASS, payload: keyword });
};

export const clearAllFilters = filterType => (dispatch) => {
  dispatch({ type: CLEAR_FILTERS, payload: filterType });
};

export const queryAnswers = async (source, query, mapType = MAP_TYPE.questionAndAnswer) => {
  try {
    const CONCEPT_TYPE = localStorage.getItem('type');
    const USER_TYPE_NAME = localStorage.getItem('typeName');

    let url = `${CONCEPT_TYPE}/${USER_TYPE_NAME}/collections/${source}/concepts/?${query}*&verbose=true`;
    if (source === INTERNAL_MAPPING_DEFAULT_SOURCE) {
      url = `/orgs/${source}/sources/${source}/concepts/?q=${query}*&limit=0&verbose=true`;
    }
    const response = await instance.get(url);
    const defaults = { map_type: mapType };
    const options = response.data.map(concept => ({
      ...concept,
      ...defaults,
      value: `${concept.url}`,
      label: `${concept.source}: ${concept.display_name}`,
    }));
    return options;
  } catch (error) {
    return [];
  }
};

export const addNewAnswerRow = answer => (dispatch) => {
  dispatch({ type: ADD_NEW_ANSWER_ROW, payload: answer });
};

export const addNewSetRow = set => (dispatch) => {
  dispatch({ type: ADD_NEW_SET_ROW, payload: set });
};

export const addSelectedAnswersToState = (answer, uniqueKey) => (dispatch) => {
  dispatch({ type: ADD_SELECTED_ANSWERS, payload: { answer, uniqueKey } });
};

export const addSelectedSetsToState = (set, uniqueKey) => (dispatch) => {
  dispatch({ type: ADD_SELECTED_SETS, payload: { set, uniqueKey } });
};

export const removeSelectedAnswer = uniqueKey => (dispatch) => {
  dispatch({ type: REMOVE_SELECTED_ANSWER, payload: uniqueKey });
};

export const removeSelectedSet = uniqueKey => (dispatch) => {
  dispatch({ type: REMOVE_SELECTED_SET, payload: uniqueKey });
};

export const addAnswerMappingToConcept = async (url, source, answers, ownerType = 'users', owner = localStorage.getItem('username')) => {
  try {
    const mappingUrl = `/${ownerType}/${owner}/sources/${source}/mappings/`;
    const answerMappings = answers.map(answer => ({
      map_type: answer.map_type,
      from_concept_url: url,
      to_concept_url: answer.url,
      external_id: String(uuid()),
    }));

    const promises = answerMappings.map(mapping => instance.post(mappingUrl, mapping));

    await axios.all(promises);
  } catch (error) {
    notify.show('An error occurred while adding your answer mappings', 'error', 3000);
  }
};

export const addSetMappingToConcept = async (url, source, sets, ownerType = 'users', owner = localStorage.getItem('username')) => {
  try {
    const mappingUrl = `/${ownerType}/${owner}/sources/${source}/mappings/`;
    const setMappings = sets.map(set => ({
      map_type: set.map_type,
      from_concept_url: url,
      to_concept_url: set.url,
      external_id: String(uuid()),
    }));

    const promises = setMappings.map(mapping => instance.post(mappingUrl, mapping));

    await axios.all(promises);
  } catch (error) {
    notify.show('A network error occurred while adding your set mappings. Please retry.', 'error', 3000);
  }
};

export const prepopulateAnswers = (answers) => {
  const prepopulatedAnswers = answers
    .map(answer => Object.assign(answer, { prePopulated: true }))
    .filter(answer => answer.retired !== true);
  return {
    type: PRE_POPULATE_ANSWERS,
    payload: prepopulatedAnswers,
  };
};

export const unPopulateThisAnswer = (answer) => {
  const newAns = {
    ...answer,
    prePopulated: false,
  };
  return {
    type: UN_POPULATE_THIS_ANSWER,
    payload: newAns,
  };
};

export const unpopulateSet = (set) => {
  const newSet = {
    ...set,
    prePopulated: false,
  };
  return {
    type: UNPOPULATE_SET,
    payload: newSet,
  };
};

export const prePopulateSets = (sets) => {
  const prePopulatedSets = sets
    .map(set => Object.assign(set, { prePopulated: true }))
    .filter(set => set.retired !== true);
  return {
    type: PRE_POPULATE_SETS,
    payload: prePopulatedSets,
  };
};

export const unpopulatePrepopulatedAnswers = () => (dispatch) => {
  dispatch({
    type: UNPOPULATE_PRE_POPULATED_ANSWERS,
  });
};

export const unpopulatePrepopulatedSets = () => (dispatch) => {
  dispatch({
    type: UNPOPULATE_PRE_POPULATED_SETS,
  });
};

export const addConceptToDictionary = (id, dataUrl) => async (dispatch) => {
  const newConcept = `${dataUrl}${id}/`;
  const urlConstruct = dataUrl.split('/');
  const userType = urlConstruct[1];
  const sourceName = urlConstruct[4];
  const username = urlConstruct[2];
  const sourceUrl = `${userType}/${username}/sources/${sourceName}/`;

  try {
    const toConceptReferences = await recursivelyFetchConceptMappings(
      [id],
      0,
      fromConceptCodes => api.mappings.list.fromAConceptInASource(sourceUrl, fromConceptCodes),
    );
    if (toConceptReferences.length) {
      await api.dictionaries.addReferencesToCollection(
        userType, username, sourceName, toConceptReferences, false,
      );
    }
  } catch (e) {
    notify.show('Some mapping concepts were not added to the collection', 'error', 3000);
  }

  try {
    const response = await api.dictionaries.addReferencesToCollection(
      userType, username, sourceName, [newConcept],
    );
    dispatch(isSuccess(response.data, ADD_CONCEPT_TO_DICTIONARY));
  } catch (error) {
    notify.show('An error occurred', 'error', 3000);
  }
  dispatch(isFetching(false));
};

export const buildNewMappingData = (mapping, fromConceptUrl) => {
  const {
    sourceObject,
    map_type,
    to_concept_code,
    to_concept_name,
  } = mapping;

  return isExternalSource(sourceObject) ? ({
    map_type,
    from_concept_url: fromConceptUrl,
    to_source_url: sourceObject.url,
    to_concept_code,
    to_concept_name,
    external_id: String(uuid()),
  }) : ({
    map_type,
    from_concept_url: fromConceptUrl,
    to_concept_url: `${sourceObject.url}concepts/${to_concept_code}/`,
    to_concept_name,
    external_id: String(uuid()),
  });
};

export const fetchConceptsFromASource = async (sourceUrl, query) => {
  try {
    const response = await api.concepts.list.conceptsInASource(sourceUrl, query);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      notify.show(`Could not load concepts: ${error.response.data}. Please retry.`, 'error', 2000);
    } else {
      notify.show('Could not load concepts. Please retry.', 'error', 2000);
    }
    return [];
  }
};

export const CreateMapping = (data, from_concept_url, source, ownerType, owner) => {
  const url = `/${ownerType}/${owner}/sources/${source}/mappings/`;
  const newMappings = data.filter(mapping => mapping && mapping.isNew);
  return axios.all(newMappings.map((mapping) => {
    const mappingData = buildNewMappingData(mapping, from_concept_url);
    return instance.post(url, mappingData);
  }));
};

export const createNewConcept = (data, dataUrl, ownerType = 'users', owner = localStorage.getItem('username')) => async (dispatch) => {
  dispatch(isFetching(true));
  const url = dataUrl;
  let createdConcept;
  try {
    notify.show('creating concept, please wait...', 'warning');
    const response = await instance.post(url, data);
    createdConcept = response.data;
    if (data.answers) {
      await addAnswerMappingToConcept(
        response.data.url,
        response.data.source,
        removeBlankSetsOrAnswers(data.answers),
        ownerType,
        owner,
      );
    }
    if (data.sets) {
      await addSetMappingToConcept(
        response.data.url,
        response.data.source,
        removeBlankSetsOrAnswers(data.sets),
        ownerType,
        owner,
      );
    }
    await CreateMapping(
      removeBlankMappings(data.mappings), response.data.url, response.data.source, ownerType, owner,
    );
  } catch (error) {
    notify.hide();
    if (error.response) {
      const { response } = error;
      notify.show(`An error occurred when creating a concept.
 ${
  Object.keys(response.data).map(e => response.data[e]).toString()
} for ${
  Object.keys(error.response.data).toString()
}`, 'error', 5000);
    } else {
      notify.show('An error occurred when creating a concept. Please retry.', 'error', 2000);
    }
  } finally {
    if (createdConcept) {
      await dispatch(addConceptToDictionary(createdConcept.id, dataUrl));
      dispatch(isSuccess(createdConcept, CREATE_NEW_CONCEPT));
    }
  }
  return dispatch(isFetching(false));
};

export const fetchExistingConcept = conceptUrl => async (dispatch) => {
  dispatch(isFetching(true));
  notify.show('Retrieving concept details, please wait...', 'warning', 2000);
  const url = conceptUrl;
  try {
    const response = await instance.get(url);
    dispatch(isSuccess(response.data, FETCH_EXISTING_CONCEPT));

    let { mappings } = response.data;
    if (!mappings) mappings = [];

    const answers = mappings.filter(map => map.map_type === 'Q-AND-A');
    const sets = mappings.filter(map => map.map_type === MAP_TYPE.conceptSet);
    dispatch(prepopulateAnswers(answers));
    dispatch(prePopulateSets(sets));
  } catch (error) {
    notify.show('Could not retrieve concept details', 'error', 3000);
    if (error.response) {
      dispatch(isErrored(error.response.data, FETCH_EXISTING_CONCEPT_ERROR));
    }
  }
  dispatch(isFetching(false));
};

export const buildUpdateMappingData = (mapping) => {
  const {
    sourceObject,
    map_type,
    to_concept_code,
    to_concept_name,
  } = mapping;

  return isExternalSource(sourceObject) ? ({
    map_type,
    to_source_url: sourceObject.url,
    to_concept_code,
    to_concept_name,
  }) : ({
    map_type,
    to_concept_url: `${sourceObject.url}concepts/${to_concept_code}/`,
    to_concept_name,
  });
};

export const UpdateMapping = (data) => {
  const updatedMappings = data.filter(mapping => mapping && !mapping.isNew);
  return axios.all(updatedMappings.map((mapping) => {
    const mappingData = buildUpdateMappingData(mapping);
    return instance.put(mapping.url, mappingData);
  }));
};

export const updateConcept = (conceptUrl, data, history, source, concept, collectionUrl, ownerType = 'users', owner = localStorage.getItem('username')) => async (dispatch) => {
  dispatch(isFetching(true));
  let updatedConcept;
  const url = conceptUrl;
  try {
    const response = await instance.put(url, data);
    updatedConcept = response.data;

    const currentMappings = await api.mappings.list.fromAConceptInACollection(
      collectionUrl,
      concept.id,
    );
    // we delete all of this concept's mappings references in the collection
    // so we can take advantage of cascadeMappings when updating the concept in the collection later
    if (currentMappings && currentMappings.data && currentMappings.data.length) {
      await api.dictionaries.references.delete.fromACollection(
        collectionUrl,
        currentMappings.data.map(mapping => mapping.version_url),
      );
    }

    await CreateMapping(removeBlankMappings(data.mappings), concept.url, source, ownerType, owner);
    await UpdateMapping(removeBlankMappings(data.mappings));
    await addAnswerMappingToConcept(
      response.data.url,
      response.data.source,
      removeBlankSetsOrAnswers(data.answers),
      ownerType,
      owner,
    );
    await addSetMappingToConcept(
      response.data.url,
      response.data.source,
      removeBlankSetsOrAnswers(data.sets),
      ownerType,
      owner,
    );

    dispatch(isSuccess(response.data, UPDATE_CONCEPT));
    notify.show('Concept successfully updated', 'success', 3000);
    dispatch(isFetching(false));
    return response.data;
  } catch (error) {
    if (error.response) {
      const { response } = error;
      notify.show(`Could not update concept details,
      ${
  Object.keys(response.data).map(e => response.data[e]).toString()
} for ${
  Object.keys(error.response.data).toString()
}`, 'error', 3000);
      dispatch(isErrored(error.response.data, FETCH_EXISTING_CONCEPT_ERROR));
    } else {
      notify.show('An error occurred when updating the concept. Please retry.', 'error', 2000);
    }
    dispatch(isFetching(false));
  }
  if (updatedConcept) return updatedConcept;
  history.goBack();
  return false;
};

export const clearPreviousConcept = () => (dispatch) => {
  dispatch({ type: CLEAR_PREVIOUS_CONCEPT });
};

export const unretireMapping = url => async (dispatch) => {
  dispatch(isFetching(true));
  try {
    const response = await instance.put(url, { retired: false });
    dispatch(isSuccess(response.data, UPDATE_CONCEPT));
    notify.show('Mapping Un-retired', 'success', 5000);
    return response.data;
  } catch (error) {
    notify.show('Could not un-retire mapping', 'error', 3000);
    dispatch(isFetching(false));
    return null;
  }
};
