import deepFreeze from 'deep-freeze';
import authReducer from '../redux/reducers/authReducers';
import {
  AUTHENTICATED,
  AUTHENTICATION_FAILED,
  AUTHENTICATION_IN_PROGRESS,
  LOGGED_OUT,
} from '../redux/actions/types';

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
      loading: false,
      payload: { ...responseData },
    };

    deepFreeze(state);
    deepFreeze(action);

    expect(authReducer(state, action)).toEqual({
      loggedIn: true,
      loading: false,
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
      loading: false,
      payload: { ...response },
    };

    deepFreeze(state);
    deepFreeze(action);

    expect(authReducer(state, action)).toEqual({
      loggedIn: false,
      loading: false,
      payload: { ...response },
    });
  });

  it('should respond correctly for loading', () => {
    action = {
      type: AUTHENTICATION_IN_PROGRESS,
      loggedIn: false,
      loading: true,
    };

    deepFreeze(state);
    deepFreeze(action);

    expect(authReducer(state, action)).toEqual({
      loggedIn: false,
      loading: true,
    });
  });

  it('should respond correctly for logout', () => {
    action = {
      type: LOGGED_OUT,
      loggedIn: false,
    };

    deepFreeze(state);
    deepFreeze(action);

    expect(authReducer(state, action)).toEqual({
      loggedIn: false,
    });
  });
});
