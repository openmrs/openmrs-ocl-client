import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { createMockStore } from 'redux-test-utils';
import { MemoryRouter as Router } from 'react-router';

import { notify } from 'react-notify-toast';
import Authenticate, { checkAuth } from '../../components/Auth';
import { authenticated, notAuthenticated } from '../__mocks__/fakeStore';
import TestComponent from '../__mocks__/FakeComponent';

jest.mock('react-notify-toast');

let store = createMockStore(authenticated);
const props = {
  history: { push: jest.fn() },
  location: { pathname: '/' },
};

describe('higher-order component', () => {
  let WrapperComponent;

  beforeEach(() => {
    WrapperComponent = Authenticate(TestComponent);
  });

  test('[Authenticate] should render without crashing', () => {
    const wrapper = mount(<Provider store={store}>
      <WrapperComponent {...props} />
    </Provider>);
    expect(wrapper).toMatchSnapshot();
  });

  test('[Authenticate] should render with unauthenticated data without crashing', () => {
    store = createMockStore(notAuthenticated);
    localStorage.clear();
    const wrapper = mount(<Provider store={store}>
      <Router>
        <WrapperComponent {...props} />
      </Router>
    </Provider>);
    expect(wrapper).toMatchSnapshot();
  });
});

describe('checking for authentication', () => {
  it('should log out user', () => {
    const notifyMock = jest.fn();
    notify.show = notifyMock;
    const event = { key: null };
    localStorage.clear();
    checkAuth(event);
    expect(notifyMock).toHaveBeenCalledWith('You have been logged out', 'warning', 3000);
    notifyMock.mockRestore();
  });

  it('should redirect user to login page on logout', () => {
    localStorage.setItem('token', 'Token sdfghxscfvgbh');
    const notifyMock = jest.fn();
    const event = { key: 'token' };
    notify.show = notifyMock;
    checkAuth(event);
    expect(notifyMock).toHaveBeenCalledWith('Logged in successfully', 'success', 3000);
    notifyMock.mockRestore();
  });
});
