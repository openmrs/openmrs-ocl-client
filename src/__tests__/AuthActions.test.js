import { Login, AUTHENTICATED } from '../ActionCreators/AuthActionCreators';

describe('Login', () => {
  const response = {
    data: {},
  };
  const responseData = {
    type: AUTHENTICATED,
    payload: response.data,
  };

  it('should return action type and payload', () => {
    expect(Login(response)).toEqual(responseData);
  });
});
