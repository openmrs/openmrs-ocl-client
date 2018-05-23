import React from 'react';
import { mount } from 'enzyme';
import { StaticRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import LoginComponent from '../components/Login';

// create any initial state needed
const initialState = {
  users: {
    loggedIn: false,
  },
};
// here it is possible to pass in any middleware if needed into //configureStore
const mockStore = configureStore();
let store;
let wrapper;

beforeEach(() => {
  // creates the store with any initial state
  store = mockStore(initialState);
  wrapper = mount(<StaticRouter context={{}}>
    <LoginComponent store={store} />
  </StaticRouter>);
});

describe('Login Component', () => {
  it('should render without crashing', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should respond to input changes', () => {
    wrapper
      .find('[name="username"]')
      .simulate('change', { target: { name: 'username', value: 'js' } });
    expect(wrapper.find('[name="username"]').prop('value')).toBe('js');
  });
});
