import { AUTHENTICATED, LOGGED_OUT } from '../redux/actions/types';
import { login, logout } from '../redux/actions/auth/authActionCreators';

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
