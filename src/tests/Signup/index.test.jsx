import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter as Router } from 'react-router';
import { Signup } from '../../components/Signup/components/container/index';

let wrapper;

beforeEach(() => {
  wrapper = mount(<Router>
    <Signup />
  </Router>);
});

describe('Sign up Component', () => {
  it('should render without crashing', () => {
    expect(wrapper).toMatchSnapshot();
  });
  it('should handle text input', () => {
    const event = {
      preventDefault: jest.fn(),
      target: {
        value: 'user',
        name: 'firstname',
      },
    };
    const spy = jest.spyOn(wrapper.find('Signup').instance(), 'handleInput');
    wrapper.instance().forceUpdate();
    wrapper.find('#firstName').simulate('change', event);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should handle text lastname input', () => {
    const event = {
      preventDefault: jest.fn(),
      target: {
        value: 'user',
        name: 'lastname',
      },
    };
    const spy = jest.spyOn(wrapper.find('Signup').instance(), 'handleInput');
    wrapper.instance().forceUpdate();
    wrapper.find('#lastname').simulate('change', event);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should handle text email input', () => {
    const event = {
      preventDefault: jest.fn(),
      target: {
        value: 'user@gmail.com',
        name: 'email',
      },
    };
    const spy = jest.spyOn(wrapper.find('Signup').instance(), 'handleInput');
    wrapper.instance().forceUpdate();
    wrapper.find('#email').simulate('change', event);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should handle text userName input', () => {
    const event = {
      preventDefault: jest.fn(),
      target: {
        value: 'user',
        name: 'username',
      },
    };
    const spy = jest.spyOn(wrapper.find('Signup').instance(), 'handleInput');
    wrapper.instance().forceUpdate();
    wrapper.find('#userName').simulate('change', event);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should handle text password input', () => {
    const event = {
      preventDefault: jest.fn(),
      target: {
        value: 'user',
        name: 'password',
      },
    };
    const spy = jest.spyOn(wrapper.find('Signup').instance(), 'handleInput');
    wrapper.instance().forceUpdate();
    wrapper.find('#password').simulate('change', event);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
