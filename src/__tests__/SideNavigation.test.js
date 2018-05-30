import React from 'react';
import { mount } from 'enzyme';
import SideNavigation from '../components/SideNavigation';

const wrapper = mount(<SideNavigation />);

describe('SideNavigation Component', () => {
  it('should render without crashing', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
