import React from 'react';
import { mount } from 'enzyme';
import NotFound from '../../components/NotFound';

describe('Not found Component', () => {
  const wrapper = mount(<NotFound />);
  it('should render without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(mount.bind(null, <NotFound />)).not.toThrow();
  });
});
