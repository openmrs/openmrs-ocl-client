import { notify } from 'react-notify-toast';
import instance from '../../../../config/axiosConfig';
import { ADD_EXISTING_CONCEPTS } from '../../types';
import { isSuccess } from '../../globalActionCreators';

const addExistingConceptsAction = data => async (dispatch) => {
  const typeName = localStorage.getItem('typeName');
  const dictionaryId = localStorage.getItem('dictionaryId');
  const userType = localStorage.getItem('type');
  const url = `${userType}/${typeName}/collections/${dictionaryId}/references/`;
  const payload = await instance.put(url, data);
  dispatch(isSuccess(payload.data, ADD_EXISTING_CONCEPTS));
  const conceptName = localStorage.getItem('conceptName');
  if (payload.data[0].added === true) {
    notify.show(`Concept ${conceptName} successfully added to your dictionary`, 'success', 3000);
  }
  notify.show(`Concept ${conceptName} already exists in your dictionary, add a new one`, 'error', 3000);
};
export default addExistingConceptsAction;

