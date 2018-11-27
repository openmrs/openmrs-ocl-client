import React from 'react';
import { mount, shallow } from 'enzyme';
import { createMockStore } from 'redux-test-utils';
import { Provider } from 'react-redux';
import Router from 'react-mock-router';

import {
  DictionaryMappings,
  mapStateToProps,
} from '../../../components/dictionaryConcepts/containers/DictionaryMappings';

const store = createMockStore({
  organizations: {
    organizations: [],
  },
});
let wrapper;
let props;

describe('Test suite for dictionary mappings components', () => {
  beforeEach(() => {
    props = {
      match: {
        params: {
          typeName: 'dev-col',
          type: 'orgs',
          collectionName: 'dev-col',
          dictionaryName: 'dev-col',
        },
      },
      location: {
        pathname: '/random/path',
      },
      fetchDictionaryMappings: jest.fn(),
      mappings: [{
        to_concept_name: 'random_name',
        from_concept_name: 'random_name',
        map_type: 'Map As Type',
        source: 'random source',
      }],
      filteredClass: ['Diagnosis'],
      filteredSources: ['CIEL'],
      loading: false,
      to: 'random',
    };
    localStorage.setItem('dictionaryPathName', '/concepts/users/admin/858738987555379984/Malaria/en');
    wrapper = mount(<Provider store={store}>
      <Router>
        <DictionaryMappings {...props} />
      </Router>
    </Provider>);
  });

  it('should render component without breaking', () => {
    localStorage.setItem('dictionaryName', 'Malaria');
    expect(wrapper.find('section').length).toEqual(2);
    expect(wrapper).toMatchSnapshot();
  });

  it('should paginate components with more than 10 mappings', () => {
    props = {
      match: {
        params: {
          typeName: 'dev-col',
          type: 'orgs',
          collectionName: 'dev-col',
          dictionaryName: 'dev-col',
        },
      },
      location: {
        pathname: '/random/path',
      },
      fetchDictionaryMappings: jest.fn(),
      mappings: [
        {
        to_concept_name: 'random_name',
        from_concept_name: 'random_name',
        map_type: 'Map As Type',
        source: 'random source',
      },
        {
        to_concept_name: 'random_name',
        from_concept_name: 'random_name',
        map_type: 'Map As Type',
        source: 'random source',
      },
        {
        to_concept_name: 'random_name',
        from_concept_name: 'random_name',
        map_type: 'Map As Type',
        source: 'random source',
      },
        {
        to_concept_name: 'random_name',
        from_concept_name: 'random_name',
        map_type: 'Map As Type',
        source: 'random source',
      },
        {
        to_concept_name: 'random_name',
        from_concept_name: 'random_name',
        map_type: 'Map As Type',
        source: 'random source',
      },
        {
        to_concept_name: 'random_name',
        from_concept_name: 'random_name',
        map_type: 'Map As Type',
        source: 'random source',
      },
        {
        to_concept_name: 'random_name',
        from_concept_name: 'random_name',
        map_type: 'Map As Type',
        source: 'random source',
      },
        {
        to_concept_name: 'random_name',
        from_concept_name: 'random_name',
        map_type: 'Map As Type',
        source: 'random source',
      },
        {
        to_concept_name: 'random_name',
        from_concept_name: 'random_name',
        map_type: 'Map As Type',
        source: 'random source',
      },
        {
        to_concept_name: 'random_name',
        from_concept_name: 'random_name',
        map_type: 'Map As Type',
        source: 'random source',
      },
        {
        to_concept_name: 'random_name',
        from_concept_name: 'random_name',
        map_type: 'Map As Type',
        source: 'random source',
      },
      ],
      filteredClass: ['Diagnosis'],
      filteredSources: ['CIEL'],
      loading: false,
      to: 'random',
    };
    localStorage.setItem('dictionaryPathName', '/concepts/users/admin/858738987555379984/Malaria/en');
    wrapper = mount(<Provider store={store}>
      <Router>
        <DictionaryMappings {...props} />
      </Router>
    </Provider>);
    expect(wrapper.find('.-totalPages').text()).toBe('2');
  });

  it('should test loader', () => {
    const app = shallow(<DictionaryMappings {...props} />);
    app.setProps({
      mapppings: [],
      loading: true,
    });
    expect(app.find('Loader').length).toEqual(1);
  });

  it('should show no mappings', () => {
    const propsHere = {
      match: {
        params: {
          typeName: 'dev-col',
          type: 'orgs',
          collectionName: 'dev-col',
          dictionaryName: 'dev-col',
        },
      },
      location: {
        pathname: '/random/path',
      },
      fetchDictionaryMappings: jest.fn(),
      filteredClass: ['Diagnosis'],
      filteredSources: ['CIEL'],
      to: 'random',
      mappings: [],
      loading: false,
    };
    const app = shallow(<DictionaryMappings {...propsHere} />);
    expect(app.find('h3').text()).toBe('No mappings found! ');
  });

  it('should have initial state', () => {
    const app = shallow(<DictionaryMappings {...props} />);
    expect(app.state().mappingLimit).toBe(10);
  });

  it('should filter mappings in the table', () => {
    const event = {
      target: {
        value: 'random',
      },
    };
    const dictionaryMappingsWrapper = wrapper.find('DictionaryMappings').instance();
    const spy = jest.spyOn(dictionaryMappingsWrapper, 'filterCaseInsensitive');
    dictionaryMappingsWrapper.forceUpdate();
    wrapper.find('ReactTable').find('input').at(0).simulate('change', event);
    expect(spy).toHaveBeenCalled();
  });

  it('should test mapStateToProps', () => {
    const initialState = {
      match: {
        params: {
          typeName: 'dev-col',
          type: 'orgs',
          collectionName: 'dev-col',
          dictionaryName: 'dev-col',
        },
      },
      concepts: {
        loading: false,
      },
      organizations: {
        mappings: [],
      },
    };
    expect(mapStateToProps(initialState).loading).toEqual(false);
  });
});
