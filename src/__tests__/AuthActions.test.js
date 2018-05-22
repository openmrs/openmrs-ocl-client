import { Login, AUTHENTICATED, Logout, LOGGED_OUT } from '../ActionCreators/AuthActionCreators';

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
    expect(Login(response)).toEqual(responseData);
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
    expect(Logout(response)).toEqual(responseData);
  });
});

