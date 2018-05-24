import React from 'react';
import { mount } from 'enzyme';
import Loader from '../components/Loader';

const wrapper = mount(<Loader />);

describe('Loader Component', () => {
  it('should render without crashing', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
