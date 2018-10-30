import React from 'react';
import { shallow } from 'enzyme';
import UserDashboard from '../../components/dashboard/components/dictionary/user/UserDashboard';

describe('Tests functionality of User Dashbard Component', () => {
  it('renders without crashing', () => {
    const props = {
      organizations: [],
    };
    const wrapper = shallow(<UserDashboard {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
