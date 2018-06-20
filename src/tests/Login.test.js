import React from 'react';
import { mount } from 'enzyme';
import Router from 'react-mock-router';
import { Login } from '../components/Login';

let wrapper;

const props = {
  loginAction: jest.fn(),
  history: { push: jest.fn() },
  loading: false,
};

beforeEach(() => {
  wrapper = mount(<Router>
    <Login {...props} />
  </Router>);
});

describe('Login Component', () => {
  it('should render without crashing', () => {
    expect(wrapper).toMatchSnapshot();
  });
  it('renders loginAction functions', () => {
    expect(wrapper.find('LoginAction')).toBeTruthy();
  });
  it('should respond to input changes', () => {
    wrapper
      .find('[name="username"]')
      .simulate('change', { target: { name: 'username', value: 'js' } });
    expect(wrapper.find('[name="username"]').prop('value')).toBe('js');
  });

  it('submits data', () => {
    wrapper.find('form').simulate('submit', { preventDefault: () => {} });
  });
});
