import React from 'react';
import { mount } from 'enzyme';
import Loader from '../components/Loader';

describe('Loader Component', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(<Loader />);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('should render a loader with classname of \'loader\'', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('div').props().className).toEqual('loader');
  });

  it('should render a smaller loader when \'smaller\' is true', () => {
    const props = { smaller: true };
    wrapper = mount(<Loader {...props} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('div').props().className).toEqual('smaller-loader');
  });
});
