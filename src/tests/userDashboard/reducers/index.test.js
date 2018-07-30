import deepFreeze from 'deep-freeze';
import reducer from '../../../redux/reducers/user';
import dictionary from '../../__mocks__/dictionaries';
import {
  GET_USER,
  FETCH_USER_DICTIONARY,
  FETCH_USER_ORGANIZATION,
  IS_FETCHING,
  CLEAR_DICTIONARY,
} from '../../../redux/actions/types';

let state;
let action;

beforeEach(() => {
  state = {
    userDictionary: [],
    userOrganization: [],
    orgDictionary: [],
    loading: false,
    user: {
      name: '',
      orgs: 0,
      public_collections: 0,
    },
  };
  action = {};
});

describe('Test suite for user dashboard reducer', () => {
  it('should not change state if no action passed', () => {
    expect(reducer(state, action)).toBe(state);
  });

  it('should handle GET_USER', () => {
    action = {
      type: GET_USER,
      payload: [{ id: '1a', name: 'emasys', orgs: 2 }],
    };

    deepFreeze(state);
    deepFreeze(action);

    expect(reducer(state, action)).toEqual({
      ...state,
      user: action.payload,
    });
  });
  it('should handle FETCH_USER_DICTIONARY', () => {
    action = {
      type: FETCH_USER_DICTIONARY,
      payload: [dictionary],
    };

    deepFreeze(state);
    deepFreeze(action);

    expect(reducer(state, action)).toEqual({
      ...state,
      userDictionary: action.payload,
    });
  });
  it('should handle FETCH_USER_ORGANIZATION', () => {
    action = {
      type: FETCH_USER_ORGANIZATION,
      payload: [{ id: 'Test', name: 'Test org', url: '/orgs/Test/' }],
    };

    deepFreeze(state);
    deepFreeze(action);

    expect(reducer(state, action)).toEqual({
      ...state,
      userOrganization: action.payload,
    });
  });
  it('should handle IS_FETCHING', () => {
    action = {
      type: IS_FETCHING,
      payload: false,
    };

    deepFreeze(state);
    deepFreeze(action);

    expect(reducer(state, action)).toEqual({
      ...state,
      loading: action.payload,
    });
  });
  it('should handle CLEAR_DICTIONARY', () => {
    action = {
      type: CLEAR_DICTIONARY,
      payload: [],
    };

    deepFreeze(state);
    deepFreeze(action);
    expect(reducer(state, action)).toEqual({
      ...state,
      orgDictionary: action.payload,
    });
  });
});
