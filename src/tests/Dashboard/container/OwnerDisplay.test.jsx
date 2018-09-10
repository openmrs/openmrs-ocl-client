import React from 'react';
import { mount, shallow } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { OwnerDictionary, mapStateToProps } from '../../../components/dashboard/container/OwnerDictionary';
import dictionaries from '../../__mocks__/dictionaries';
import organizations from '../../__mocks__/organizations';
import { DictionariesSearch } from '../../../components/dashboard/components/dictionary/DictionariesSearch';
import OwnerListDictionaries from '../../../components/dashboard/components/dictionary/OwnerListDictionaries';

jest.mock('../../../components/dashboard/components/dictionary/AddDictionary');
describe('DictionaryDisplay', () => {
  it('should render without any dictionary data', () => {
    const props = {
      fetchDictionaries: jest.fn(),
      dictionaries: [],
      isFetching: false,
      organizations: [organizations],
    };
    const wrapper = (
      <MemoryRouter>
        <OwnerDictionary {...props} />
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
    };
    const wrapper = mount(<MemoryRouter>
      <OwnerDictionary {...props} />
    </MemoryRouter>);
    expect(wrapper.find('.dashboard-wrapper')).toHaveLength(1);
    expect(wrapper).toMatchSnapshot();
  });
  it('should render preloader spinner', () => {
    const props = {
      fetchDictionaries: jest.fn(),
      dictionaries: [],
      isFetching: true,
      organizations: [],
    };
    const wrapper = shallow(<MemoryRouter>
      <OwnerDictionary {...props} />
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
    };
    const wrapper = mount(<MemoryRouter>
      <OwnerDictionary {...props} />
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
    };
    const component = shallow(<DictionariesSearch {...properties} />);
    expect(component).toMatchSnapshot();
  });
  it('It sets the state of the component show:true', () => {
    const props = {
      fetchDictionaries: jest.fn(),
      dictionaries: [],
      isFetching: false,
      organizations: [organizations],
    };
    const wrapper = mount(<MemoryRouter>
      <OwnerDictionary {...props} />
    </MemoryRouter>);
    wrapper.find('.add-dictionaries').simulate('click');
    wrapper.setState({ show: true });
    expect(wrapper.state().show).toEqual(true);
  });
  describe(' wrapper components', () => {
    it('should render a list of dictionaries', () => {
      const length = jest.fn();
      const props = {
        dictionaries: length,
      };
      const component = mount(<OwnerListDictionaries {...props} />);
      expect(component).toMatchSnapshot();
    });

    it('returns the openmrs user dictionaries when it receives correct properties', () => {
      const props = {
        dictionaries: [dictionaries],
        fetching: false,
        fetchData: true,
      };
      const component = mount(<OwnerListDictionaries {...props} />);
      expect(component.props().dictionaries[0].repository_type).toBe('OpenMRSDictionary');
    });
  });
});
describe('DictionaryCard', () => {
  it('should render with data', () => {
    const props = {
      fetchDictionaries: jest.fn(),
      dictionary: [dictionaries],
    };
    const wrapper = shallow(<OwnerDictionary {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
