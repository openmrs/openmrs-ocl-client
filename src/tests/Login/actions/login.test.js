import moxios from 'moxios';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  AUTHENTICATED,
  AUTHENTICATION_IN_PROGRESS,
  AUTHENTICATION_FAILED,
  LOGGED_OUT,
} from '../../../redux/actions/types';
import { loginAction, logoutAction } from '../../../redux/actions/auth/authActions';
import users from '../../__mocks__/users';

jest.mock('react-notify-toast');
const mockStore = configureStore([thunk]);

const data = {
  username: 'testuser',
  password: '12345678',
};

describe('Test suite for login action', () => {
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('should handle login', async () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: {
          data: {},
        },
      });
    });

    const expectedActions = [
      { type: AUTHENTICATION_IN_PROGRESS, loading: true },
      { type: AUTHENTICATED, payload: users, loading: false },
    ];

    const store = mockStore({});

    return store.dispatch(loginAction(data)).then(() => {
      expect(store.getActions()[0].type).toEqual(expectedActions[0].type);
      expect(store.getActions()[0].loading).toEqual(expectedActions[0].loading);
      expect(store.getActions()[1].type).toEqual(expectedActions[1].type);
    });
  });

  it('should handle invalid password for admin', async () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 401,
        response: {
          detail: 'Passwords did not match.',
        },
      });
    });

    const expectedActions = [
      {
        type: AUTHENTICATION_IN_PROGRESS,
        loading: true,
      },
      {
        type: AUTHENTICATION_FAILED,
        payload: { errorMessage: 'Either the username or password you provided is incorrect.' },
        loading: false,
      }];

    const store = mockStore();
    return store
      .dispatch(loginAction(data))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should handle invalid credentials for non-admin users', async () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 401,
        response: {
          detail: 'Not found.',
        },
      });
    });

    const expectedActions = [
      {
        type: AUTHENTICATION_IN_PROGRESS,
        loading: true,
      },
      {
        type: AUTHENTICATION_FAILED,
        payload: { errorMessage: 'No such user was found.' },
        loading: false,
      }];

    const store = mockStore();
    return store
      .dispatch(loginAction(data))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should handle login attempt when offline', async () => {
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.reject({
        status: 599,
      });
    });

    const expectedActions = [
      {
        type: AUTHENTICATION_IN_PROGRESS,
        loading: true,
      },
      {
        type: AUTHENTICATION_FAILED,
        loading: false,
        payload: { errorMessage: undefined },
      }];

    const store = mockStore();
    return store
      .dispatch(loginAction(data))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should handle logout error', () => {
    const expectedActions = [
      {
        type: AUTHENTICATION_IN_PROGRESS,
        loading: true,
      },
      {
        type: LOGGED_OUT,
        payload: {},
      }];

    const store = mockStore();

    store.dispatch(logoutAction());

    expect(store.getActions()).toEqual(expectedActions);
  });
});
