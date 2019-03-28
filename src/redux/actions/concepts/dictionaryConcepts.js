import uuid from 'uuid/v4';
import { notify } from 'react-notify-toast';
import axios from 'axios';
import { showNetworkError } from '../dictionaries/dictionaryActionCreators';
import { INTERNAL_MAPPING_DEFAULT_SOURCE, MAP_TYPE } from '../../../components/dictionaryConcepts/components/helperFunction';

import {
  POPULATE_SIDEBAR,
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
  FETCH_NEXT_CONCEPTS,
  TOTAL_CONCEPT_COUNT,
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
} from '../types';
import {
  isFetching,
  getDictionaryConcepts,
  isErrored,
  isSuccess,
} from '../globalActionCreators/index';

import instance from '../../../config/axiosConfig';

export const paginateConcepts = (concepts, limit = 10, offset = 0) => (dispatch, getState) => {
  let conceptList = concepts;
  if (!concepts) {
    conceptList = getState().concepts.dictionaryConcepts;
  }
  const compare = (firstConcept, nextConcept) => {
    if (firstConcept.updated_on < nextConcept.updated_on) return 1;
    if (firstConcept.updated_on > nextConcept.updated_on) return -1;
    return 0;
  };

  conceptList.sort(compare);
  const payload = conceptList.slice(offset, limit);
  const conceptCount = conceptList.length;
  dispatch(isSuccess(conceptCount, TOTAL_CONCEPT_COUNT));
  dispatch(isSuccess(payload, FETCH_NEXT_CONCEPTS));
};

export const populateSidenav = () => (dispatch, getState) => {
  const payload = getState().concepts.dictionaryConcepts;
  dispatch({ type: POPULATE_SIDEBAR, payload });
};

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
  query = '',
  limit = 0,
  page = 1,
) => async (dispatch, getState) => {
  dispatch(isFetching(true));
  let url = `${conceptType}/${conceptOwner}/collections/${conceptName}/concepts/?includeMappings=true&q=${query}&limit=${limit}&page=${page}&verbose=true`;
  const filterBySource = getState().concepts.filteredBySource;
  const filterByClass = getState().concepts.filteredByClass;

  if (filterBySource.length > 0 && filterByClass.length > 0) {
    url = `${conceptType}/${conceptOwner}/collections/${conceptName}/concepts/?q=${query}&limit=${limit}&page=${page}&verbose=true&source=${filterBySource.join(',')}&conceptClass=${filterByClass.join(',')}`;
  }
  if (filterBySource.length > 0 && filterByClass.length === 0) {
    url = `${conceptType}/${conceptOwner}/collections/${conceptName}/concepts/?q=${query}&limit=${limit}&page=${page}&verbose=true&source=${filterBySource.join(',')}`;
  }
  if (filterBySource.length === 0 && filterByClass.length > 0) {
    url = `${conceptType}/${conceptOwner}/collections/${conceptName}/concepts/?q=${query}&limit=${limit}&page=${page}&verbose=true&conceptClass=${filterByClass.join(',')}`;
  }
  try {
    const response = await instance.get(`${url}&includeRetired=1`);
    dispatch(getDictionaryConcepts(response.data, FETCH_DICTIONARY_CONCEPT));
    dispatch(paginateConcepts(response.data));
    if (query === '' && filterByClass.length === 0 && filterBySource.length === 0) {
      dispatch(populateSidenav());
    }
  } catch (error) {
    if (error.response !== undefined) {
      dispatch(isErrored(error.response.data, FETCH_DICTIONARY_CONCEPT));
    }
    showNetworkError();
  }
  dispatch(isFetching(false));
};

export const fetchConceptsByName = query => async (dispatch) => {
  dispatch(isFetching(true));
  const CONCEPT_TYPE = localStorage.getItem('type');
  const USER_TYPE_NAME = localStorage.getItem('typeName');
  const DICTIONARY_ID = localStorage.getItem('dictionaryId');

  const url = `${CONCEPT_TYPE}/${USER_TYPE_NAME}/collections/${DICTIONARY_ID}/concepts/?includeMappings=true&${query}*&verbose=true`;
  try {
    const response = await instance.get(url);
    dispatch(isSuccess(response.data, FETCH_DICTIONARY_CONCEPT));
    dispatch(isFetching(false));
  } catch (error) {
    dispatch(isFetching(false));
    notify.show('Something went wrong with your search, please try again.', 'error', 3000);
  }
};

export const filterBySource = (
  keyword,
  conceptType,
  conceptOwner,
  conceptName,
  query = '',
) => (dispatch) => {
  dispatch({ type: FILTER_BY_SOURCES, payload: keyword });
  dispatch(fetchDictionaryConcepts(conceptType, conceptOwner, conceptName, query));
};

export const filterByClass = (
  keyword,
  conceptType,
  conceptOwner,
  conceptName,
  query = '',
) => (dispatch) => {
  dispatch({ type: FILTER_BY_CLASS, payload: keyword });
  dispatch(fetchDictionaryConcepts(conceptType, conceptOwner, conceptName, query));
};

export const queryAnswers = async (source, query) => {
  const CONCEPT_TYPE = localStorage.getItem('type');
  const USER_TYPE_NAME = localStorage.getItem('typeName');

  let url = `${CONCEPT_TYPE}/${USER_TYPE_NAME}/collections/${source}/concepts/?${query}*&verbose=true`;
  if (source === INTERNAL_MAPPING_DEFAULT_SOURCE) {
    url = `/orgs/${source}/sources/${source}/concepts/?q=${query}*&limit=0&verbose=true`;
  }
  const response = await instance.get(url);
  const defaults = { map_type: MAP_TYPE.questionAndAnswer };
  const options = response.data.map(concept => ({
    ...concept,
    ...defaults,
    value: `${concept.url}`,
    label: `${concept.source}: ${concept.display_name}`,
  }));
  return options;
};

export const addNewAnswerRow = answer => (dispatch) => {
  dispatch({ type: ADD_NEW_ANSWER_ROW, payload: answer });
};

export const addSelectedAnswersToState = (answer, uniqueKey) => (dispatch) => {
  dispatch({ type: ADD_SELECTED_ANSWERS, payload: { answer, uniqueKey } });
};

export const removeSelectedAnswer = uniqueKey => (dispatch) => {
  dispatch({ type: REMOVE_SELECTED_ANSWER, payload: uniqueKey });
};

export const addAnswerMappingToConcept = async (url, source, answers) => {
  const user = localStorage.getItem('username');
  const mappingUrl = `/users/${user}/sources/${source}/mappings/`;
  const answerMappings = answers.map(answer => ({
    map_type: answer.map_type,
    from_concept_url: url,
    to_concept_url: answer.url,
  }));

  const promises = answerMappings.map(mapping => instance.post(mappingUrl, mapping));

  try {
    await axios.all(promises);
  } catch (error) {
    notify.show('An error occurred while adding your answer mappings', 'error', 3000);
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

export const unpopulatePrepopulatedAnswers = () => (dispatch) => {
  dispatch({
    type: UNPOPULATE_PRE_POPULATED_ANSWERS,
  });
};

export const addConceptToDictionary = (id, dataUrl) => async (dispatch) => {
  const newConcept = `${dataUrl}${id}/`;
  const urlConstruct = dataUrl.split('/');
  const userType = urlConstruct[1];
  const sourceName = urlConstruct[4];
  const username = urlConstruct[2];
  const data = { data: { expressions: [newConcept] } };
  const url = `${userType}/${username}/collections/${sourceName}/references/`;
  try {
    const response = await instance.put(url, data);
    dispatch(isSuccess(response.data, ADD_CONCEPT_TO_DICTIONARY));
  } catch (error) {
    notify.show('An error occurred', 'error', 3000);
  }
  dispatch(isFetching(false));
};

export const fetchSourceConcepts = async (source, query, index) => {
  const url = `/orgs/${source}/sources/${source}/concepts/?q=${query}*&limit=0&verbose=true`;
  const response = await instance.get(url);
  const options = response.data.map(concept => ({
    value: concept.url,
    label: `ID(${concept.id}) - ${concept.display_name}`,
    index,
  }));
  return options;
};

export const CreateMapping = (data, from_concept_url, source) => {
  const url = `/users/${localStorage.getItem('username')}/sources/${source}/mappings/`;
  axios.all(data.map((mapping) => {
    const mappingData = mapping.source !== INTERNAL_MAPPING_DEFAULT_SOURCE ? ({
      map_type: mapping.map_type,
      from_concept_url,
      to_source_url: mapping.to_source_url || mapping.source,
      to_concept_code: mapping.to_concept_code,
      to_concept_name: mapping.to_concept_name,
    }) : ({
      map_type: mapping.map_type,
      from_concept_url,
      to_concept_url: mapping.to_source_url,
      to_concept_name: mapping.to_concept_name,
    });
    return (
      mapping.isNew && instance.post(url, mappingData)
    );
  }));
};

export const createNewConcept = (data, dataUrl) => async (dispatch) => {
  dispatch(isFetching(true));
  const url = dataUrl;
  try {
    notify.show('creating concept, please wait...', 'warning', 1000);
    const response = await instance.post(url, data);
    dispatch(isSuccess(response.data, CREATE_NEW_CONCEPT));
    dispatch(addConceptToDictionary(response.data.id, dataUrl));
    notify.show('creating concept, please wait...', 'warning', 3000);
    CreateMapping(data.mappings, response.data.url, response.data.source);
    await addAnswerMappingToConcept(response.data.url, response.data.source, data.answers);
  } catch (error) {
    if (error.response) {
      const { response } = error;
      notify.show(`An error occurred when creating a concept.
 ${
  Object.keys(response.data).map(e => response.data[e]).toString()
} for ${
  Object.keys(error.response.data).toString()
}`, 'error', 3000);
      dispatch(isErrored(error.response.data, CREATE_NEW_CONCEPT));
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
    const answers = response.data.mappings.filter(map => map.map_type === 'Q-AND-A');
    dispatch(prepopulateAnswers(answers));
  } catch (error) {
    notify.show('Could not retrieve concept details', 'error', 3000);
    if (error.response) {
      dispatch(isErrored(error.response.data, FETCH_EXISTING_CONCEPT_ERROR));
    }
  }
  dispatch(isFetching(false));
};

export const UpdateMapping = (data) => {
  axios.all(data.map((mapping) => {
    const mappingData = mapping.source !== INTERNAL_MAPPING_DEFAULT_SOURCE ? ({
      map_type: mapping.map_type,
      to_source_url: mapping.source,
      to_concept_code: mapping.to_concept_code,
      to_concept_name: mapping.to_concept_name,
    }) : ({
      map_type: mapping.map_type,
      to_concept_url: mapping.to_source_url,
      to_concept_name: mapping.to_concept_name,
    });

    return (
      !mapping.isNew && instance.put(mapping.url, mappingData)
    );
  }));
};

export const updateConcept = (conceptUrl, data, history) => async (dispatch) => {
  dispatch(isFetching(true));
  const url = conceptUrl;
  try {
    const response = await instance.put(url, data);
    CreateMapping(data.mappings, data.from_concept_url, data.source);
    UpdateMapping(data.mappings);
    dispatch(isSuccess(response.data, UPDATE_CONCEPT));
    await addAnswerMappingToConcept(response.data.url, response.data.source, data.answers);
    notify.show('Concept successfully updated', 'success', 3000);
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
    }
    dispatch(isFetching(false));
  }
  return history.goBack();
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
  } catch (error) {
    notify.show('Could not un-retire mapping', 'error', 3000);
    dispatch(isFetching(false));
  }
};
