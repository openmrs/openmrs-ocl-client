import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import LoginDetails from '../../components/login/container/LoginDetails';

describe('Not found Component', () => {
  const wrapper = mount(<MemoryRouter><LoginDetails /></MemoryRouter>);
  it('should render without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(mount.bind(null, <MemoryRouter><LoginDetails /></MemoryRouter>)).not.toThrow();
  });
});
