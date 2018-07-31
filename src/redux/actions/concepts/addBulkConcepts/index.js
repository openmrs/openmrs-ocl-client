import { notify } from 'react-notify-toast';
import instance from '../../../../config/axiosConfig';
import { isFetching, isSuccess } from '../../globalActionCreators';
import { FETCH_BULK_CONCEPTS } from '../../types';

// eslint-disable-next-line
export const fetchBulkConcepts = (source = 'CIEL') => async dispatch => {
  dispatch(isFetching(true));
  const url = `orgs/${source}/sources/${source}/concepts/?limit=10&verbose=true`;
  try {
    const response = await instance.get(url);
    dispatch(isSuccess(response.data, FETCH_BULK_CONCEPTS));
    dispatch(isFetching(false));
  } catch (error) {
    dispatch(isFetching(false));
    notify.show('an error occurred, reload your browser', 'error', 3000);
  }
};
