import reducer from '../../../redux/reducers/dictionaryReducer';
import dictionaryreducer from '../../../redux/reducers/dictionaryReducers';
import userReducer from '../../../redux/reducers/user/index';
import {
  FETCHING_ORGANIZATIONS,
  FETCHING_DICTIONARIES,
  IS_FETCHING, ADDING_DICTIONARY,
  FETCHING_DICTIONARY,
  FETCHING_VERSIONS,
  CLEAR_DICTIONARY,
  EDIT_DICTIONARY_SUCCESS,
  RELEASING_HEAD_VERSION,
} from '../../../redux/actions/types';
import dictionaries from '../../__mocks__/dictionaries';
import versions from '../../__mocks__/versions';

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
  versions: [],
  dictionary: {},
  loading: false,
  isReleased: false,
};
const dictionary = dictionaries;

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

  it('should handle FETCHING_VERSIONS', () => {
    expect(dictionaryreducer(
      { versions: [] },
      {
        type: FETCHING_VERSIONS,
        payload: [versions],
      },
    )).toEqual({ versions: [versions] });
  });

  it('should handle RELEASING_HEAD_VERSION', () => {
    expect(dictionaryreducer(
      { isReleased: false },
      {
        type: RELEASING_HEAD_VERSION,
        payload: { released: true },
      },
    )).toEqual({ isReleased: true });
  });
  it('should clear a dictionary', () => {
    expect(dictionaryreducer(
      { dictionary },
      {
        type: CLEAR_DICTIONARY,
      },
    )).toEqual({ dictionary: {} });
  });
  it('should return new dictionary on edit success', () => {
    expect(dictionaryreducer(
      { dictionary: [] },
      {
        type: EDIT_DICTIONARY_SUCCESS,
        payload: dictionary,
      },
    )).toEqual({ dictionary });
  });
});
it('should handle FETCHING_VERSIONS', () => {
  expect(dictionaryreducer(
    { versions: [] },
    {
      type: FETCHING_VERSIONS,
      payload: [versions],
    },
  )).toEqual({ versions: [versions] });
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
