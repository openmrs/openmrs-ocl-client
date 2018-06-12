import { notify } from 'react-notify-toast';
import { addDictionary, fetchOrganizations } from './dictionaryActions';
import api from './../../api';

export const createDictionary = data => dispatch =>
  api.dictionaries
    .createDictionary(data)
    .then(payload => dispatch(
      addDictionary(payload),
      notify.show('Successfully added dictionary to your organization', 'success', 6000),
    ))
    .catch(error => /* eslint-disable */
      notify.show(`${error.response.data.__all__[0]}`, 'error', 6000));

export const createDictionaryUser = data => dispatch =>
  api.dictionaries
    .createDictionaryUser(data)
    .then(payload => dispatch(
      addDictionary(payload),
      notify.show('Successfully added your dictionary', 'success', 6000),
    ))
    .catch(error =>
      notify.show(`${error.response.data.__all__[0]}`, 'error', 6000));

export const fetchingOrganizations = () => dispatch =>
  api.organizations
    .fetchOrganizations()
    .then(payload =>
      dispatch(fetchOrganizations(payload)));
