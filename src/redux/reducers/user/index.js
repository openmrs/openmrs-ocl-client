import {
  GET_USER,
  FETCH_USER_DICTIONARY,
  FETCH_USER_ORGANIZATION,
  IS_FETCHING,
  FETCH_ORG_DICTIONARY,
  CLEAR_DICTIONARY,
} from '../../actions/types';

const userInitialState = {
  userDictionary: [],
  orgDictionary: [],
  userOrganization: [],
  loading: false,
  user: {
    name: '',
    orgs: 0,
    public_collections: 0,
  },
};
const userReducer = (state = userInitialState, action) => {
  switch (action.type) {
    case GET_USER:
      return {
        ...state,
        user: action.payload,
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
    case FETCH_ORG_DICTIONARY:
      return {
        ...state,
        orgDictionary: [...state.orgDictionary, ...action.payload],
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
    default:
      return state;
  }
};

export default userReducer;
