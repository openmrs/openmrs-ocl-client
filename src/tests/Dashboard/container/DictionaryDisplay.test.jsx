import React from 'react';
import { mount, shallow } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import {
  DictionaryDisplay,
  mapStateToProps,
} from '../../../components/dashboard/container/DictionariesDisplay';
import dictionaries, { mockDictionaries } from '../../__mocks__/dictionaries';
import organizations from '../../__mocks__/organizations';
import { DictionariesSearch } from '../../../components/dashboard/components/dictionary/DictionariesSearch';
import ListDictionaries from '../../../components/dashboard/components/dictionary/ListDictionaries';
import DictionaryCard from '../../../components/dashboard/components/dictionary/DictionaryCard';

describe('DictionaryDisplay', () => {
  it('should render without any dictionary data', () => {
    const props = {
      fetchDictionaries: jest.fn(),
      dictionaries: [],
      isFetching: false,
      organizations: [organizations],
      searchDictionaries: jest.fn(),
      clearDictionaries: jest.fn(),
      history: { push: jest.fn() },
    };
    const wrapper = (
      <MemoryRouter>
        <DictionaryDisplay {...props} />
      </MemoryRouter>
    );
    const rShallow = shallow(wrapper);
    expect(rShallow).toMatchSnapshot();
  });
  it('should render with dictionary data', () => {
    const props = {
      fetchDictionaries: jest.fn(),
      dictionaries: [dictionaries],
      isFetching: true,
      organizations: [organizations],
      searchDictionaries: jest.fn(),
      clearDictionaries: jest.fn(),
      history: { push: jest.fn() },
    };
    const wrapper = mount(<MemoryRouter>
      <DictionaryDisplay {...props} />
    </MemoryRouter>);
    expect(wrapper).toMatchSnapshot();
  });
  it('should go to the next page', () => {
    const props = {
      fetchDictionaries: jest.fn(),
      dictionaries: mockDictionaries,
      isFetching: false,
      organizations: [organizations],
      searchDictionaries: jest.fn(),
      clearDictionaries: jest.fn(),
      history: { push: jest.fn() },
    };
    const wrapper = mount(<MemoryRouter>
      <DictionaryDisplay {...props} />
    </MemoryRouter>);
    wrapper.find('.nxt').simulate('click');
    expect(wrapper.find(DictionaryDisplay).instance().state.currentPage).toEqual(2);
  });
  it('Should handle click on dictionary card', () => {
    const props = {
      fetchDictionaries: jest.fn(),
      dictionaries: [dictionaries],
      isFetching: false,
      organizations: [organizations],
      history: { push: jest.fn() },
      searchDictionaries: jest.fn(),
      clearDictionaries: jest.fn(),
    };
    const wrapper = mount(<MemoryRouter>
      <DictionaryDisplay {...props} />
    </MemoryRouter>);
    wrapper.find('.card-link').simulate('click');
    expect(wrapper).toMatchSnapshot();
  });
  it('should render preloader spinner', () => {
    const props = {
      fetchDictionaries: jest.fn(),
      dictionaries: [],
      isFetching: true,
      organizations: [],
      searchDictionaries: jest.fn(),
      clearDictionaries: jest.fn(),
      history: { push: jest.fn() },
    };
    const wrapper = shallow(<MemoryRouter>
      <DictionaryDisplay {...props} />
    </MemoryRouter>);
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
    const props = {
      fetchDictionaries: jest.fn(),
      dictionaries: [],
      isFetching: true,
      clearDictionaries: jest.fn(),
      searchDictionaries: jest.fn(),
      onSearch: jest.fn(),
      onSubmit: jest.fn(),
      organizations: [organizations],
      history: { push: jest.fn() },
    };
    const wrapper = mount(<MemoryRouter>
      <DictionaryDisplay {...props} />
    </MemoryRouter>);
    const event = { target: { name: 'searchInput', value: 'openmrs' } };
    wrapper.find('#search').simulate('change', event);
    wrapper.find('#submit-search-form').simulate('submit', {
      preventDefault: () => {},
    });
  });
  it('should render the Dictionary search component', () => {
    const properties = {
      onSearch: jest.fn(),
      onsubmit: jest.fn(),
      searchValue: 'random search text',
      onSubmit: jest.fn(),
    };
    const component = shallow(<DictionariesSearch {...properties} />);
    expect(component).toMatchSnapshot();
  });
  describe('wrapper components', () => {
    it('should render a list of dictionaries', () => {
      const props = {
        dictionaries: mockDictionaries,
        fetching: false,
      };
      const component = mount(<MemoryRouter>
        <ListDictionaries {...props} />
      </MemoryRouter>);
      expect(component).toMatchSnapshot();
    });
    it('returns the openmrs user dictionaries when it receives correct properties', () => {
      const props = {
        dictionaries: [dictionaries],
        fetching: false,
        fetchData: true,
      };
      const component = mount(<MemoryRouter>
        <ListDictionaries {...props} />
      </MemoryRouter>);
      expect(component.props().children.props.dictionaries[0].repository_type).toBe('OpenMRSDictionary');
    });
  });
});
describe('DictionaryCard', () => {
  it('should render with data', () => {
    const props = {
      dictionary: [dictionaries],
    };
    const wrapper = shallow(<DictionaryCard {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
