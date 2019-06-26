import { notify } from 'react-notify-toast';
import axios from 'axios';
import { union } from 'lodash';
import { isSuccess, isFetching, isErrored } from '../globalActionCreators';
import {
  GET_USER,
  FETCH_USER_DICTIONARY,
  FETCH_USER_ORGANIZATION,
  CLEAR_DICTIONARY,
  USER_IS_MEMBER,
  USER_IS_NOT_MEMBER,
  NETWORK_ERROR,
  SET_DICTIONARIES_OWNED_BY_A_USERS_ORGS,
} from '../types';
import instance from '../../../config/axiosConfig';
import { filterUserPayload } from '../../reducers/util';
import { logout } from '../auth/authActionCreators';
import api from '../../api';

const REQUEST_DENIED_MESSAGE = 'Request failed with status code 401';

export const fetchUser = (username, props) => async (dispatch) => {
  const url = `users/${username}/`;
  try {
    const response = await instance.get(url);
    dispatch(isSuccess(response.data, GET_USER));
  } catch (error) {
    if (error.message === REQUEST_DENIED_MESSAGE) {
      dispatch(logout());
      props.history.push('/');
      return;
    }
    const message = 'An error occurred with your internet connection, please fix it and try reloading the page.';
    notify.show(message, 'error', 3000);
    dispatch(isErrored(message, NETWORK_ERROR));
  }
};

export const fetchUserOrganizations = (username, props) => async (dispatch) => {
  const url = `users/${username}/orgs/`;
  try {
    const response = await instance.get(url);
    dispatch(isSuccess(response.data, FETCH_USER_ORGANIZATION));
  } catch (error) {
    if (error.message === REQUEST_DENIED_MESSAGE) {
      dispatch(logout());
      props.history.push('/');
      return;
    }
    notify.show('An error occurred with your internet connection, please fix it and try reloading the page.', 'error', 3000);
  }
};

export const fetchsUserDictionaries = (username, props) => async (dispatch) => {
  const url = `/users/${username}/collections/?q=${''}&limit=${0}&page=${1}&verbose=true`;
  dispatch(isFetching(true));
  try {
    const response = await instance.get(url);
    const result = filterUserPayload(username, response.data);
    dispatch(isSuccess(result, FETCH_USER_DICTIONARY));
  } catch (error) {
    if (error.message === REQUEST_DENIED_MESSAGE) {
      dispatch(logout());
      props.history.push('/');
      return;
    }
    notify.show('An error occurred with your internet connection, please fix it and try reloading the page.', 'error', 3000);
  }
};

export const setDictionariesOwnedByAUsersOrgs = dictionaries => ({
  type: SET_DICTIONARIES_OWNED_BY_A_USERS_ORGS,
  payload: dictionaries,
});

export const fetchOrganizationDictionaries = organizationUrls => async (dispatch) => {
  try {
    const requests = organizationUrls.map(
      organizationUrl => api.dictionaries.list.fromAnOrganization(organizationUrl),
    );
    const results = await axios.all(requests);
    const dictionaries = union(...results.map(result => result.data));
    dispatch(setDictionariesOwnedByAUsersOrgs(dictionaries));
  } catch (e) {
    notify.show('Dictionaries owned by your organizations could not be loaded. Try reloading the page.', 'error', '3000');
    dispatch(setDictionariesOwnedByAUsersOrgs([]));
  }
};

export const fetchUserData = (username, props) => async (dispatch, getState) => {
  dispatch(isFetching(true));
  await dispatch(fetchUser(username, props));
  await dispatch(fetchsUserDictionaries(username, props));
  await dispatch(fetchUserOrganizations(username, props));
  const userOrganisations = getState().user.userOrganization;
  await dispatch(fetchOrganizationDictionaries(
    userOrganisations.map(organization => organization.url),
  ));
  dispatch(isFetching(false));
};

export const clearDictionaryData = () => (dispatch) => {
  dispatch({ type: CLEAR_DICTIONARY, payload: [] });
};

export const fetchMemberStatus = url => async (dispatch) => {
  let response;
  dispatch(isFetching(true));
  try {
    response = await instance.get(url);
  } catch (error) {
    if (error.response.status === 403 || error.response.status === 404) {
      dispatch(isFetching(false));
      return dispatch(isErrored(false, USER_IS_NOT_MEMBER));
    }
  }
  if (response.data === '' && response.status === 204) {
    dispatch(isFetching(false));
    return dispatch(isSuccess(true, USER_IS_MEMBER));
  }
  return dispatch(isFetching(false));
};
