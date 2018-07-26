import React from 'react';
import { mount } from 'enzyme';
import Router from 'react-mock-router';
import {
  mapStateToProps,
  UserDashboard,
} from '../../../components/userDasboard/container/UserDashboard';

import dictionary from '../../__mocks__/dictionaries';

jest.mock('../../../components/dashboard/components/dictionary/AddDictionary');

describe('Test suite for dictionary concepts components', () => {
  const props = {
    fetchUserData: jest.fn(),
    loading: false,
    userDictionary: [],
    userOrganization: [],
    orgDictionary: [],
    clearDictionaryData: jest.fn(),
    user: {
      name: 'emasys nd',
      orgs: '',
      public_collections: 0,
    },
  };
  it('should render without breaking', () => {
    const wrapper = mount(<Router>
      <UserDashboard {...props} />
    </Router>);
    expect(wrapper.find('.greetings h5').text()).toEqual('Welcome emasys nd');

    expect(wrapper).toMatchSnapshot();
  });

  it('should handle add dictionary button', () => {
    const simulateLoading = {
      fetchUserData: jest.fn(),
      loading: true,
      userDictionary: [],
      userOrganization: [],
      orgDictionary: [],
      clearDictionaryData: jest.fn(),
      user: {
        name: 'emasys nd',
        orgs: '',
        public_collections: 1,
      },
    };
    const propsWithOneOrg = {
      fetchUserData: jest.fn(),
      loading: false,
      userDictionary: [dictionary],
      orgDictionary: [],
      clearDictionaryData: jest.fn(),
      userOrganization: [
        {
          id: 'Test',
          name: 'Test org',
          url: '/orgs/Test/',
        },
      ],
      user: {
        name: 'emasys nd',
        orgs: 1,
        public_collections: 1,
      },
    };
    let wrapper = mount(<Router>
      <UserDashboard {...propsWithOneOrg} />
    </Router>);
    wrapper = mount(<Router>
      <UserDashboard {...simulateLoading} />
    </Router>);
    wrapper.find('#add-dictionary').simulate('click');
  });
  it('should render at least one dictionary card', () => {
    const propsWithDictionary = {
      fetchUserData: jest.fn(),
      loading: false,
      userDictionary: [dictionary],
      orgDictionary: [],
      clearDictionaryData: jest.fn(),
      userOrganization: [
        {
          id: 'Test',
          name: 'Test org',
          url: '/orgs/Test/',
        },
        {
          id: 'Test2',
          name: 'Test org 2',
          url: '/orgs/Test2/',
        },
      ],
      user: {
        name: 'emasys nd',
        orgs: 2,
        public_collections: 1,
      },
    };
    const wrapper = mount(<Router>
      <UserDashboard {...propsWithDictionary} />
    </Router>);

    expect(wrapper.find('#dictionaryHeader h6').text()).toEqual('ChrisMain4567');
    wrapper.unmount();
  });

  it('should test mapStateToProps', () => {
    const initialState = {
      user: {
        userDictionary: [],
        userOrganization: [],
        orgDictionary: [],
        loading: false,
        user: {
          name: '',
          orgs: 0,
          public_collections: 0,
        },
      },
    };
    expect(mapStateToProps(initialState).user).toEqual({
      name: '',
      orgs: 0,
      public_collections: 0,
    });
    expect(mapStateToProps(initialState).userDictionary).toEqual([]);
    expect(mapStateToProps(initialState).userOrganization).toEqual([]);
    expect(mapStateToProps(initialState).orgDictionary).toEqual([]);
    expect(mapStateToProps(initialState).loading).toEqual(false);
  });

  it('Should handle click on dictionary card', () => {
    const propsWithDictionary = {
      fetchUserData: jest.fn(),
      loading: false,
      userDictionary: [dictionary],
      orgDictionary: [],
      clearDictionaryData: jest.fn(),
      history: { push: jest.fn() },
      userOrganization: [
        {
          id: 'Test',
          name: 'Test org',
          url: '/orgs/Test/',
        },
        {
          id: 'Test2',
          name: 'Test org 2',
          url: '/orgs/Test2/',
        },
      ],
      user: {
        name: 'emasys nd',
        orgs: 2,
        public_collections: 1,
      },
    };
    const wrapper = mount(<Router>
      <UserDashboard {...propsWithDictionary} />
    </Router>);
    wrapper.find('.card-link').simulate('click');
    expect(wrapper).toMatchSnapshot();
  });
});
