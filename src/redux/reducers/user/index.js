import {
  GET_USER,
  FETCH_USER_DICTIONARY,
  FETCH_USER_ORGANIZATION,
  IS_FETCHING,
  CLEAR_DICTIONARY,
  ADDING_DICTIONARY,
  USER_IS_MEMBER,
  USER_IS_NOT_MEMBER,
  NETWORK_ERROR,
} from '../../actions/types';

const userInitialState = {
  userDictionary: [],
  userOrganization: [],
  loading: false,
  user: {
    name: '',
    orgs: 0,
    public_collections: 0,
  },
  userIsMember: false,
  networkError: '',
};
const userReducer = (state = userInitialState, action) => {
  switch (action.type) {
    case GET_USER:
      return {
        ...state,
        user: action.payload,
      };
    case ADDING_DICTIONARY:
      return {
        ...state,
        userDictionary: state.userDictionary.concat(action.payload),
      };
    case FETCH_USER_DICTIONARY:
      return {
        ...state,
        userDictionary: action.payload,
      };
    case CLEAR_DICTIONARY:
      return {
        ...state,
        orgDictionary: action.payload,
      };
    case IS_FETCHING:
      return {
        ...state,
        loading: action.payload,
      };
    case FETCH_USER_ORGANIZATION:
      return {
        ...state,
        userOrganization: action.payload,
      };
    case USER_IS_MEMBER:
      return {
        ...state,
        userIsMember: action.payload,
      };
    case USER_IS_NOT_MEMBER:
      return {
        ...state,
        userIsMember: action.payload,
      };
    case NETWORK_ERROR:
      return {
        ...state,
        networkError: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
