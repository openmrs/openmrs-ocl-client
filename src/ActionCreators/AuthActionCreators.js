
const AUTHENTICATED = 'loggedin_user';
const AUTHENTICATION_FAILED = 'login_failed';
const AUTHENTICATION_IN_PROGRESS = 'login-progess';
const LOGGED_OUT = 'logout';
const LOGOUT_FAILED = 'logout_failed';

const Login = response => ({
  type: AUTHENTICATED,
  payload: response.data,
  loading: false,
});

const LoginFailed = errorMessage => ({
  type: AUTHENTICATION_FAILED,
  payload: { errorMessage },
  loading: false,
});

const LoginStarted = () => ({
  type: AUTHENTICATION_IN_PROGRESS,
  loading: true,
});

const Logout = () => ({
  type: LOGGED_OUT,
  payload: {},
});

const LogoutFailed = errorMessage => ({
  type: LOGOUT_FAILED,
  payload: { errorMessage },
});

export {
  AUTHENTICATED,
  AUTHENTICATION_FAILED,
  AUTHENTICATION_IN_PROGRESS,
  LOGGED_OUT,
  LOGOUT_FAILED,
  Login,
  LoginFailed,
  LoginStarted,
  Logout,
  LogoutFailed,
};
