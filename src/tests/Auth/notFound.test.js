import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import NotFound from '../../components/NotFound';

describe('Not found Component', () => {
  const wrapper = mount(<MemoryRouter><NotFound /></MemoryRouter>);
  it('should render without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(mount.bind(null, <MemoryRouter><NotFound /></MemoryRouter>)).not.toThrow();
  });
});
