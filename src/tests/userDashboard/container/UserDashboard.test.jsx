import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createMockStore } from 'redux-test-utils';
import Authenticated from '../../__mocks__/fakeStore';
import dictionary, { mockDictionaries } from '../../__mocks__/dictionaries';
import UserDashboard, {
  mapStateToProps,
} from '../../../components/userDasboard/container/UserDashboard';

const storeObject = {
  organizations: {
    organizations: [],
  },
  sources: {
    sources: [],
  },
  loading: false,
  user: {
    userDictionary: [],
    user: {
      name: 'emasys nd',
      orgs: 0,
      public_collections: 0,
    },
    userOrganization: [],
    loading: false,
  },
  dictionaries: {
    dictionaries: mockDictionaries,
    loading: false,
  },
  history: { push: jest.fn() },
};
const store = createMockStore({
  ...Authenticated,
  ...storeObject,
});
const props = {
  history: { push: jest.fn() },
};
describe('Test suite for dictionary concepts components', () => {
  beforeEach(() => {
    localStorage.setItem('username', 'chriskala');
  });
  it('should render without breaking', () => {
    const wrapper = mount(<Provider store={store}>
      <MemoryRouter>
        <UserDashboard {...props} />
      </MemoryRouter>
    </Provider>);
    expect(wrapper.find('.greetings h5').text()).toEqual('Welcome emasys nd');

    expect(wrapper).toMatchSnapshot();
  });

  it('should handle add dictionary button', () => {
    const simulateLoading = createMockStore({
      fetchUserData: jest.fn(),
      userDictionary: [],
      userOrganization: [],
      orgDictionary: [],
      clearDictionaryData: jest.fn(),
      user: {
        user: {
          name: 'emasys nd',
          orgs: 1,
          public_collections: 0,
        },
        userDictionary: [dictionary],
        userOrganization: [],
        loading: true,
      },
      history: { push: jest.fn() },
      dictionaries: {
        dictionaries: mockDictionaries,
      },
      ...storeObject,
      ...Authenticated,
    });
    const propsWithOneOrg = createMockStore({
      fetchUserData: jest.fn(),
      loading: false,
      orgDictionary: [],
      clearDictionaryData: jest.fn(),
      user: {
        user: {
          name: 'emasys nd',
          orgs: 1,
          public_collections: 0,
          loading: false,
        },
        userOrganization: [
          {
            id: 'Test',
            name: 'Test org',
            url: '/orgs/Test/',
          },
        ],
        userDictionary: [dictionary],
        loading: false,
      },
      history: { push: jest.fn() },
      dictionaries: [],
      ...storeObject,
      ...Authenticated,
    });
    const loadingWrapper = mount(<MemoryRouter>
      <Provider store={simulateLoading}>
        <UserDashboard {...props} />
      </Provider>
    </MemoryRouter>);
    expect(loadingWrapper).toMatchSnapshot();
    const wrapper = mount(<Provider store={propsWithOneOrg}>
      <MemoryRouter>
        <UserDashboard {...props} />
      </MemoryRouter>
    </Provider>);
    wrapper.find('#add-dictionary').simulate('click');
    expect(wrapper.find('UserDashboard').instance().state.show).toBe(true);
  });
  it('should render a loader', () => {
    const propsWithDictionary = createMockStore({
      ...storeObject,
      ...Authenticated,
      fetchUserData: jest.fn(),
      loading: true,
      userDictionary: [dictionary],
      orgDictionary: [],
      clearDictionaryData: jest.fn(),
      user: {
        userDictionary: [],
        user: {
          name: 'emasys nd',
          orgs: 1,
          public_collections: 0,
        },
        userOrganization: [],
        loading: true,
      },
    });
    const wrapper = mount(<Provider store={propsWithDictionary}>
      <MemoryRouter>
        <UserDashboard {...props} />
      </MemoryRouter>
    </Provider>);
    expect(wrapper.find('.loader')).toHaveLength(1);
    expect(wrapper).toMatchSnapshot();
  });
  it('should render at least one dictionary card', () => {
    const propsWithDictionary = createMockStore({
      ...storeObject,
      ...Authenticated,
      fetchUserData: jest.fn(),
      loading: false,
      userDictionary: [dictionary],
      orgDictionary: [],
      clearDictionaryData: jest.fn(),
      user: {
        userDictionary: [dictionary],
        user: {
          name: 'emasys nd',
          orgs: 2,
          public_collections: 0,
        },
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
        loading: false,
      },
    });
    const wrapper = mount(<Provider store={propsWithDictionary}>
      <MemoryRouter>
        <UserDashboard {...props} />
      </MemoryRouter>
    </Provider>);
    expect(wrapper.find('#dictionaryHeader h6').text()).toEqual('ChrisMain4567');
    wrapper.unmount();
  });

  it('should test mapStateToProps', () => {
    const initialState = {
      user: {
        userDictionary: [],
        userOrganization: [],
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
    expect(mapStateToProps(initialState).loading).toEqual(false);
  });

  it('Should handle click on dictionary card', () => {
    const propsWithDictionary = createMockStore({
      ...storeObject,
      ...Authenticated,
      fetchUserData: jest.fn(),
      loading: false,
      userDictionary: [dictionary],
      orgDictionary: [],
      clearDictionaryData: jest.fn(),
      user: {
        userDictionary: [dictionary],
        user: {
          name: 'emasys nd',
          orgs: 1,
          public_collections: 0,
        },
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
        loading: false,
      },
    });
    const wrapper = mount(<Provider store={propsWithDictionary}>
      <MemoryRouter>
        <UserDashboard {...props} />
      </MemoryRouter>
    </Provider>);
    const spy = jest.spyOn(wrapper.find('UserDashboard').instance(), 'gotoDictionary');
    wrapper
      .find('UserDashboard')
      .instance()
      .forceUpdate();
    wrapper.find('.card-link').simulate('click');
    expect(spy).toBeCalled();
  });
});
