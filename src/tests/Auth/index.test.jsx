import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { createMockStore } from 'redux-test-utils';
import { MemoryRouter as Router } from 'react-router';

import Authenticate from '../../components/Auth';
import { authenticated, notAuthenticated } from '../__mocks__/fakeStore';
import TestComponent from '../__mocks__/FakeComponent';

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
    const wrapper = mount(<Provider store={store}>
      <Router>
        <WrapperComponent {...props} />
      </Router>
    </Provider>);
    expect(wrapper).toMatchSnapshot();
  });
});
