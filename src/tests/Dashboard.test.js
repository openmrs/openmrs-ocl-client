import React from 'react';
import { mount } from 'enzyme';
import Dashboard from '../components/Dashboard';

const wrapper = mount(<Dashboard />);

describe('Dashboard Component', () => {
  it('should render without crashing', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
