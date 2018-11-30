import React from 'react';
import { shallow } from 'enzyme';
import UserDashboard from '../../components/dashboard/components/dictionary/user/UserDashboard';
import organizations from '../__mocks__/organizations';

describe('Tests functionality of User Dashbard Component', () => {
  it('renders without crashing', () => {
    const props = {
      organizations: [],
    };
    const wrapper = shallow(<UserDashboard {...props} />);
    expect(wrapper.length).toEqual(1);
  });

  it('renders with organizations', () => {
    const props = {
      organizations: [organizations],
      viewState: 'user',
    };
    const wrapper = shallow(<UserDashboard {...props} />);
    expect(wrapper.length).toEqual(1);
  });
});
