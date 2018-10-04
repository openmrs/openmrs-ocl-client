import React from 'react';
import { mount } from 'enzyme';
import Title from '../components/Title';

describe('Title component', () => {
  it('should render without crashing', () => {
    const wrapper = mount(<Title title="OCL for OpenMRS" />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders with no title passed', () => {
    const wrapper = mount(<Title />);
    expect(wrapper).toMatchSnapshot();
  });
});
