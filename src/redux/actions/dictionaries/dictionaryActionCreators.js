import { notify } from 'react-notify-toast';
import {
  addDictionary,
  fetchOrganizations,
  isSuccess,
  isFetching,
  isErrored,
} from './dictionaryActions';
import api from './../../api';

/* eslint-disable */
export const createDictionary = data => dispatch =>
  api.dictionaries
    .createDictionary(data)
    .then(payload => dispatch(
      addDictionary(payload),
      notify.show(
        'Successfully added dictionary to your organization',
        'success', 6000,
      ),
    ))
    .catch(error =>
      notify.show(`${error.response.data.__all__[0]}`, 'error', 6000));

export const createDictionaryUser = data => dispatch =>
  api.dictionaries
    .createDictionaryUser(data)
    .then(payload => dispatch(
      addDictionary(payload),
      notify.show(
        'Successfully added your dictionary',
        'success', 6000,
      ),
    ))
    .catch(error =>
      notify.show(`${error.response.data.__all__[0]}`, 'error', 6000));

export const fetchingOrganizations = () => dispatch =>
  api.organizations
    .fetchOrganizations()
    .then(payload => dispatch(fetchOrganizations(payload)));

    export const fetchDictionaries = () => dispatch => {
      dispatch(isFetching(true));
      return api.dictionaries
        .fetchingDictionaries()
        .then(payload => {
          dispatch(isSuccess(payload));
          dispatch(isFetching(false));
        })
        .catch(error => {
          dispatch(isErrored(error.response.data));
          dispatch(isFetching(false));
        });
    }

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
