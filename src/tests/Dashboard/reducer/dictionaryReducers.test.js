import reducer from '../../../redux/reducers/dictionaryReducer';
import dictionaryreducer from '../../../redux/reducers/dictionaryReducers';
import userReducer from '../../../redux/reducers/user/index';
import { FETCHING_ORGANIZATIONS, FETCHING_DICTIONARIES, IS_FETCHING, ADDING_DICTIONARY, FETCHING_DICTIONARY } from '../../../redux/actions/types';
import dictionaries from '../../__mocks__/dictionaries';

const initialState = {};
describe('Test suite for vote reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });
  it('should handle FETCHING_ORGANIZATIONS', () => {
    expect(reducer(
      {},
      {
        type: FETCHING_ORGANIZATIONS,
        payload: {},
      },
    )).toEqual({
      organizations: {},
    });
  });
});

const state = {
  dictionaries: [],
  dictionary: {},
  loading: false,
};
describe('Test suite for dictionaries reducers', () => {
  it('should return initial state', () => {
    expect(dictionaryreducer(undefined, {})).toEqual(state);
  });
  it('should handle FETCH_DICTIONARIES', () => {
    expect(dictionaryreducer(
      { dictionaries: [] },
      {
        type: FETCHING_DICTIONARIES,
        payload: [dictionaries],
      },
    )).toEqual({ dictionaries: [dictionaries] });
  });
  it('should handle IS_FETCHING', () => {
    expect(dictionaryreducer(
      {},
      {
        type: IS_FETCHING,
        payload: false,
      },
    )).toEqual({
      loading: false,
    });
  });
  it('should fetch a dictionary', () => {
    expect(dictionaryreducer(
      { dictionary: [] },
      {
        type: FETCHING_DICTIONARY,
        payload: [dictionaries],
      },
    )).toEqual({ dictionary: [dictionaries] });
  });
});
describe('Test suite for dictionaries reducers', () => {
  it('should return inital state ADD_DICTIONARY', () => {
    expect(userReducer(
      { userDictionary: [] },
      {
        type: ADDING_DICTIONARY,
        payload: [dictionaries],
      },
    )).toEqual({ userDictionary: [dictionaries] });
  });
});
