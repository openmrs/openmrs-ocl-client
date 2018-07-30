import { notify } from 'react-notify-toast';
import { isSuccess, isFetching } from '../globalActionCreators';
import {
  GET_USER,
  FETCH_USER_DICTIONARY,
  FETCH_USER_ORGANIZATION,
  CLEAR_DICTIONARY,
} from '../types';
import instance from '../../../config/axiosConfig';
import { filterUserPayload } from '../../reducers/util';

export const fetchUser = username => async (dispatch) => {
  const url = `users/${username}/`;
  try {
    const response = await instance.get(url);
    dispatch(isSuccess(response.data, GET_USER));
  } catch (error) {
    notify.show('an error occurred, reload the page', 'error', 3000);
  }
};

export const fetchUserOrganizations = username => async (dispatch) => {
  const url = `users/${username}/orgs/`;
  try {
    const response = await instance.get(url);
    dispatch(isSuccess(response.data, FETCH_USER_ORGANIZATION));
  } catch (error) {
    notify.show('an error occurred, reload the page', 'error', 3000);
  }
};

export const fetchsUserDictionaries = username => async (dispatch) => {
  const url = `collections/?q=${''}&limit=${0}&page=${1}&verbose=true`;
  try {
    const response = await instance.get(url);
    const result = filterUserPayload(username, response.data);
    dispatch(isSuccess(result, FETCH_USER_DICTIONARY));
    dispatch(isFetching(false));
  } catch (error) {
    notify.show('an error occurred, reload the page', 'error', 3000);
  }
};

export const fetchUserData = username => (dispatch) => {
  dispatch(isFetching(true));
  dispatch(fetchUser(username));
  dispatch(fetchsUserDictionaries(username));
  dispatch(fetchUserOrganizations(username));
};

export const clearDictionaryData = () => (dispatch) => {
  dispatch({ type: CLEAR_DICTIONARY, payload: [] });
};
