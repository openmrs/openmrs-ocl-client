import React from 'react';
import moxios from 'moxios';
import { mount, shallow } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createMockStore } from 'redux-test-utils';
import Authenticated from '../../__mocks__/fakeStore';
import OwnerDictionary,
{ mapStateToProps } from '../../../components/dashboard/container/OwnerDictionary';
import { mockDictionaries } from '../../__mocks__/dictionaries';
import organizations from '../../__mocks__/organizations';
import {
  DictionariesSearch,
} from '../../../components/dashboard/components/dictionary/DictionariesSearch';
// eslint-disable-next-line max-len
import OwnerListDictionaries from '../../../components/dashboard/components/dictionary/OwnerListDictionaries';


const store = createMockStore({
  organizations: {
    organizations: [],
  },
  sources: {
    sources: [],
  },
  user: {
    userDictionary: [],
  },
  dictionaries: {
    dictionaries: mockDictionaries,
    loading: false,
  },
  ...Authenticated,
});

describe('DictionaryDisplay', () => {
  beforeEach(() => {
    localStorage.setItem('username', 'chriskala');
  });
  it('should render without any dictionary data', () => {
    const props = createMockStore({
      fetchDictionaries: jest.fn(),
      dictionaries: {
        dictionaries: [],
        loading: false,
      },
      organizations: {
        organizations: [],
      },
      sources: {
        sources: [],
      },
      user: {
        userDictionary: [],
      },
      clearDictionaries: jest.fn(),
      searchDictionaries: jest.fn(),
      onSearch: jest.fn(),
      onSubmit: jest.fn(),
      ...Authenticated,
    });
    const wrapper = mount(<Provider store={props}>
      <MemoryRouter>
        <OwnerDictionary />
      </MemoryRouter>
    </Provider>);

    expect(wrapper).toMatchSnapshot();
  });
  it('should render with dictionary data', () => {
    const props = createMockStore({
      fetchDictionaries: jest.fn(),
      dictionaries: {
        dictionaries: mockDictionaries,
        loading: false,
      },
      organizations: {
        organizations: [],
      },
      sources: {
        sources: [],
      },
      user: {
        userDictionary: [],
      },
      clearDictionaries: jest.fn(),
      searchDictionaries: jest.fn(),
      onSearch: jest.fn(),
      onSubmit: jest.fn(),
      ...Authenticated,
    });
    const wrapper = mount(<Provider store={props}>
      <MemoryRouter>
        <OwnerDictionary />
      </MemoryRouter>
    </Provider>);
    expect(wrapper.find('.dashboard-wrapper')).toHaveLength(1);
    expect(wrapper).toMatchSnapshot();
  });
  it('should render preloader spinner', () => {
    const props = createMockStore({
      fetchDictionaries: jest.fn(),
      dictionaries: {
        dictionaries: mockDictionaries,
        loading: true,
      },
      organizations: {
        organizations: [],
      },
      sources: {
        sources: [],
      },
      user: {
        userDictionary: [],
      },
      clearDictionaries: jest.fn(),
      searchDictionaries: jest.fn(),
      onSearch: jest.fn(),
      onSubmit: jest.fn(),
      ...Authenticated,
    });
    const wrapper = mount(<Provider store={props}>
      <MemoryRouter>
        <OwnerDictionary />
      </MemoryRouter>
    </Provider>);
    expect(wrapper).toMatchSnapshot();
  });
  it('should test mapStateToProps', () => {
    const initialState = {
      dictionaries: { dictionaries: [], loading: false },
      organizations: { organizations: [], loading: false },
    };
    expect(mapStateToProps(initialState).dictionaries).toEqual([]);
    expect(mapStateToProps(initialState).organizations).toEqual([]);
    expect(mapStateToProps(initialState).isFetching).toEqual(false);
  });
  it('should search for a dictionary', () => {
    const props = createMockStore({
      fetchDictionaries: jest.fn(),
      dictionaries: {
        dictionaries: mockDictionaries,
        loading: false,
      },
      organizations: {
        organizations: [],
      },
      sources: {
        sources: [],
      },
      user: {
        userDictionary: [],
      },
      clearDictionaries: jest.fn(),
      searchDictionaries: jest.fn(),
      onSearch: jest.fn(),
      onSubmit: jest.fn(),
      ...Authenticated,
    });
    const wrapper = mount(<Provider store={props}>
      <MemoryRouter>
        <OwnerDictionary />
      </MemoryRouter>
    </Provider>);
    const event = { target: { name: 'searchInput', value: 'openmrs' } };
    const event2 = { target: { name: 'searchInput', value: '', type: 'checkbox' } };
    wrapper.find('#search').simulate('change', event);
    wrapper.find('#search').simulate('change', event2);
    const spy = jest.spyOn(wrapper.find('OwnerDictionary').instance(), 'onSubmit');
    wrapper.find('#search').simulate('change', event);
    wrapper
      .find('OwnerDictionary')
      .instance()
      .forceUpdate();
    wrapper.find('#submit-search-form').simulate('submit', {
      preventDefault: () => {},
    });
    expect(spy).toHaveBeenCalled();
  });
  it('should render the Dictionary search component', () => {
    const properties = {
      onSearch: jest.fn(),
      onsubmit: jest.fn(),
      searchValue: 'random search text',
      onSubmit: jest.fn(),
    };
    const component = mount(<DictionariesSearch {...properties} />);
    expect(component).toMatchSnapshot();
  });
  it('It sets the state of the component show:true', () => {
    const wrapper = mount(<MemoryRouter>
      <Provider store={store}>
        <OwnerDictionary />
      </Provider>
    </MemoryRouter>);
    wrapper.find('.add-dictionaries').simulate('click');
    expect(wrapper.find('OwnerDictionary').instance().state.show).toEqual(true);
  });

  it('It sets the state of the component show:false', () => {
    const wrapper = mount(<MemoryRouter>
      <Provider store={store}>
        <OwnerDictionary />
      </Provider>
    </MemoryRouter>);

    wrapper.find('OwnerDictionary').instance().setState({
      show: true,
    });

    wrapper.find('OwnerDictionary').instance().handleHide();
    const showState = wrapper.find('OwnerDictionary').instance().state.show;
    expect(showState).toEqual(false);
  });

  describe(' wrapper components', () => {
    it('should render a list of dictionaries', () => {
      const props = {
        dictionaries: mockDictionaries,
        fetching: false,
        organizations: [organizations],
        searchDictionaries: jest.fn(),
        clearDictionaries: jest.fn(),
        OwnerDictionary: {},
      };
      const component = mount(<MemoryRouter>
        <OwnerListDictionaries {...props} />
      </MemoryRouter>);
      expect(component).toMatchSnapshot();
    });

    it('returns the openmrs user dictionaries when it receives correct properties', () => {
      const props = {
        dictionaries: mockDictionaries,
        fetching: false,
      };
      const component = mount(<MemoryRouter>
        <OwnerListDictionaries {...props} />
      </MemoryRouter>);
      expect(
        component.find('OwnerListDictionaries').props().dictionaries[0].repository_type,
      ).toBe('OpenMRSDictionary');
    });
  });
  it('should render with data', () => {
    localStorage.setItem('username', 'chriskala');
    const props = createMockStore({
      fetchDictionaries: jest.fn(),
      dictionaries: {
        dictionaries: mockDictionaries,
        loading: false,
      },
      organizations: {
        organizations: [],
      },
      sources: {
        sources: [],
      },
      user: {
        userDictionary: [],
      },
      clearDictionaries: jest.fn(),
      searchDictionaries: jest.fn(),
      onSearch: jest.fn(),
      onSubmit: jest.fn(),
      ...Authenticated,
    });
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: mockDictionaries,
      });
    });
    const wrapper = shallow(<Provider store={props}>
      <MemoryRouter>
        <OwnerDictionary />
      </MemoryRouter>
    </Provider>).dive();
    expect(wrapper).toMatchSnapshot();
  });
});
