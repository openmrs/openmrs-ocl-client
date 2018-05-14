// Action type
const AUTHENTICATED = 'loggedin_user';
const AUTHENTICATION_FAILED = 'login_failed';

// Action creator
const Login = response => ({
  type: AUTHENTICATED,
  payload: response.data,
});

const LoginFailed = errorMessage => ({
  type: AUTHENTICATION_FAILED,
  payload: { errorMessage },
});

export { AUTHENTICATED, AUTHENTICATION_FAILED, Login, LoginFailed };
