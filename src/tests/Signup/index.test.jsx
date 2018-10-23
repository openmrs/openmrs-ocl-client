import React from 'react';
import { mount } from 'enzyme';
import Router from 'react-mock-router';
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
});
