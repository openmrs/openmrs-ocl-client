import {
  AUTHENTICATED,
  AUTHENTICATION_FAILED,
  AUTHENTICATION_IN_PROGRESS,
  LOGGED_OUT,
} from '../ActionCreators/AuthActionCreators';

const initialState = {
  loggedIn: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATION_IN_PROGRESS:
      return {
        ...state,
        loggedIn: false,
        loading: true,
      };
    case AUTHENTICATED:
      return {
        ...state,
        payload: action.payload,
        loggedIn: true,
        loading: false,
      };
    case AUTHENTICATION_FAILED:
      return {
        ...state,
        payload: action.payload,
        loggedIn: false,
        loading: false,
      };
    case LOGGED_OUT:
      return {loggedIn: false };
    default:
      return state;
  }
};
