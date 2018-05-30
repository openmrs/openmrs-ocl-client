import { login, AUTHENTICATED, logout, LOGGED_OUT } from '../ActionCreators/AuthActionCreators';

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

