import api from '../../api';
import { searchResults, isFetching } from './GeneralSearchActions';
import { filterPayload } from '../../reducers/util';

const generalsearch = searchItem => (dispatch) => {
  if (searchItem) {
    dispatch(isFetching(true));
    return api.dictionaries
      .searchDictionaries(searchItem)
      .then((payload) => {
        const result = filterPayload(payload);
        dispatch(searchResults(result));
        dispatch(isFetching(false));
      });
  }
  dispatch(isFetching(true));
  return api.dictionaries
    .fetchingDictionaries()
    .then((payload) => {
      const result = filterPayload(payload);
      dispatch(searchResults(result));
      dispatch(isFetching(false));
    });
};

export default generalsearch;
