import {
  AUTHENTICATED, LOGGED_OUT, LOGOUT_FAILED,
} from '../redux/actions/types';
import {
  login, logout, logoutFailed,
} from '../redux/actions/auth/authActionCreators';

describe('Login', () => {
  const response = {
    data: {},
  };
  const responseData = {
    type: AUTHENTICATED,
    payload: response.data,
    loading: false,
  };

  it('should return action type and payload', () => {
    expect(login(response)).toEqual(responseData);
  });
});

describe('Logout', () => {
  const response = {
    data: {},
  };
  const responseData = {
    type: LOGGED_OUT,
    payload: {},
  };
  it('should return action type and payload', () => {
    expect(logout(response)).toEqual(responseData);
  });
});

describe('Login failed', () => {
  const response = {
    data: {},
  };
  const responseData = {
    type: LOGOUT_FAILED,
    payload: { errorMessage: { data: {} } },
  };
  it('should return action type and payload', () => {
    expect(logoutFailed(response)).toEqual(responseData);
  });
});
