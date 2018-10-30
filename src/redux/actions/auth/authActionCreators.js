import {
  AUTHENTICATED,
  AUTHENTICATION_FAILED,
  AUTHENTICATION_IN_PROGRESS,
  LOGGED_OUT,
  LOGOUT_FAILED,
} from '../types';

// Action creator
const login = response => ({
  type: AUTHENTICATED,
  payload: response.data,
  loading: false,
});

const loginFailed = errorMessage => ({
  type: AUTHENTICATION_FAILED,
  payload: { errorMessage },
  loading: false,
});

const loginStarted = () => ({
  type: AUTHENTICATION_IN_PROGRESS,
  loading: true,
});

const logout = () => ({
  type: LOGGED_OUT,
  payload: {},
});

const logoutFailed = errorMessage => ({
  type: LOGOUT_FAILED,
  payload: { errorMessage },
});

export {
  login, loginFailed, loginStarted, logout, logoutFailed,
};
