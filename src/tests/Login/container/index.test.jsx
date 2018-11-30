import React from 'react';
import { mount } from 'enzyme';
import Router from 'react-mock-router';
import { notify } from 'react-notify-toast';
import { Login } from '../../../components/login/container/index';

let wrapper;

const props = {
  loginAction: jest.fn(),
  history: { push: jest.fn() },
  loading: false,
  payload: {
    errorMessage: '123',
  },
  loggedIn: false,
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

  it('should handle UNSAFE_componentWillReceiveProps when logged in', () => {
    jest.mock('react-notify-toast');
    notify.show = jest.fn();

    const nextProps = {
      payload: {},
      loggedIn: true,
      loading: false,
    };

    wrapper.find(Login).instance().UNSAFE_componentWillReceiveProps(nextProps);

    expect(notify.show).toHaveBeenCalledWith('Logged in successfully as ', 'success', 3000);
  });

  it('should handle UNSAFE_componentWillReceiveProps when loading', () => {
    const nextProps = {
      payload: {},
      loggedIn: false,
      loading: true,
    };

    wrapper.find(Login).instance().UNSAFE_componentWillReceiveProps(nextProps);
  });

  it('should handle UNSAFE_componentWillReceiveProps when payload is an error', () => {
    jest.mock('react-notify-toast');
    notify.show = jest.fn();

    const nextProps = {
      payload: {
        errorMessage: 'I messed up',
      },
      loggedIn: false,
      loading: false,
    };

    wrapper.find(Login).instance().UNSAFE_componentWillReceiveProps(nextProps);
    expect(notify.show).toHaveBeenCalledWith('I messed up', 'error', 3000);
  });

  it('should set the button title to logging in', () => {
    const newProps = {
      ...props,
      loading: true,
    };

    const wrapper2 = mount(<Router>
      <Login {...newProps} />
    </Router>);

    expect(wrapper2.length).toEqual(1);
  });
});
