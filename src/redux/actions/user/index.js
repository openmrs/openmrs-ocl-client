import { notify } from 'react-notify-toast';
import { isSuccess, isFetching } from '../globalActionCreators';
import {
  GET_USER,
  FETCH_USER_DICTIONARY,
  FETCH_USER_ORGANIZATION,
  FETCH_ORG_DICTIONARY,
  CLEAR_DICTIONARY,
} from '../types';
import instance from '../../../config/axiosConfig';

export const fetchUser = username => async (dispatch) => {
  const url = `users/${username}`;
  try {
    const response = await instance.get(url);
    dispatch(isSuccess(response.data, GET_USER));
  } catch (error) {
    notify.show('an error occurred, reload the page', 'error', 3000);
  }
};

export const fetchOrgDictionary = org => async (dispatch) => {
  const url = `orgs/${org}/collections/?verbose=true&limit=30`;
  try {
    const response = await instance.get(url);
    dispatch(isSuccess(response.data, FETCH_ORG_DICTIONARY));
  } catch (error) {
    notify.show('an error occurred, reload the page', 'error', 3000);
  }
};

export const fetchUserOrganizations = username => async (dispatch) => {
  const url = `users/${username}/orgs`;
  try {
    const response = await instance.get(url);
    dispatch(isSuccess(response.data, FETCH_USER_ORGANIZATION));
    response.data.map(organization => dispatch(fetchOrgDictionary(organization.id)));
  } catch (error) {
    notify.show('an error occurred, reload the page', 'error', 3000);
  }
};

export const fetchUserDictionary = username => async (dispatch) => {
  const url = `users/${username}/collections/?verbose=true&limit=30`;
  try {
    const response = await instance.get(url);
    dispatch(isSuccess(response.data, FETCH_USER_DICTIONARY));
    dispatch(isFetching(false));
  } catch (error) {
    notify.show('an error occurred, reload the page', 'error', 3000);
  }
};

export const fetchUserData = username => (dispatch) => {
  dispatch(isFetching(true));
  dispatch(fetchUser(username));
  dispatch(fetchUserOrganizations(username));
  dispatch(fetchUserDictionary(username));
};

export const clearDictionaryData = () => (dispatch) => {
  dispatch({ type: CLEAR_DICTIONARY, payload: [] });
};
