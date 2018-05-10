import deepFreeze from 'deep-freeze';
import authReducer from '../Reducers/AuthReducers';
import {
  AUTHENTICATED,
  AUTHENTICATION_FAILED,
} from '../ActionCreators/AuthActionCreators';

let state;
let action;

beforeEach(() => {
  state = {};
  action = {};
});

describe('AuthReducer', () => {
  it('should not change state if no action passed', () => {
    expect(authReducer(state, action)).toBe(state);
  });

  it('should respond correctly to auth failure', () => {
    const responseData = {
      type: 'User',
      uuid: '5af069b8ff961600709c758c',
      username: 'hadijah315',
      name: 'HADIJAH KYAMPEIRE',
      email: 'hadijah.kyampeire@andela.com',
      company: 'Andela',
    };
    action = {
      type: AUTHENTICATED,
      payload: { ...responseData },
    };

    deepFreeze(state);
    deepFreeze(action);

    expect(authReducer(state, action)).toEqual({
      loggedIn: true,
      payload: { ...responseData },
    });
  });
  it('should respond correctly for proper authentication', () => {
    const response = {
      payload: {
        errorMessage: 'Error Occured',
      },
    };
    action = {
      type: AUTHENTICATION_FAILED,
      payload: { ...response },
    };

    deepFreeze(state);
    deepFreeze(action);

    expect(authReducer(state, action)).toEqual({
      loggedIn: false,
      payload: { ...response },
    });
  });
});
