import {
  AUTHENTICATED,
  AUTHENTICATION_FAILED,
} from '../ActionCreators/AuthActionCreators';

const initialState = {
  loggedIn: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATED:
      return {
        ...state,
        payload: action.payload,
        loggedIn: true,
      };
    case AUTHENTICATION_FAILED:
      return {
        ...state,
        payload: action.payload,
        loggedIn: false,
      };
    default:
      return state;
  }
};
