import React from 'react';
import { mount, shallow } from 'enzyme';
import { createMockStore } from 'redux-test-utils';
import { Provider } from 'react-redux';
import expect from 'expect';
import Router from 'react-mock-router';

import {
  DictionaryConcepts,
  mapStateToProps,
} from '../../../components/dictionaryConcepts/containers/DictionaryConcepts';
import concepts, { multipleConceptsMockStore } from '../../__mocks__/concepts';

const store = createMockStore({
  organizations: {
    organizations: [],
  },
});
describe('Test suite for dictionary concepts components', () => {
  it('should render component without breaking', () => {
    const props = {
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
      fetchDictionaryConcepts: jest.fn(),
      concepts: [concepts],
      filteredClass: ['Diagnosis'],
      filteredSources: ['CIEL'],
      loading: false,
      conceptsCount: 1,
      totalConceptsCount: 1,
      filterBySource: jest.fn(),
      filterByClass: jest.fn(),
      fetchMemberStatus: jest.fn(),
    };
    const wrapper = mount(<Provider store={store}><Router>
      <DictionaryConcepts {...props} />
    </Router></Provider>);
    expect(wrapper.find('h2.text-capitalize').text()).toEqual('dev-col Dictionary');

    expect(wrapper).toMatchSnapshot();
  });

  it('should search for concepts', () => {
    const props = {
      match: {
        params: {
          typeName: 'dev-col',
        },
      },
      location: {
        pathname: '/random/path',
      },
      fetchDictionaryConcepts: jest.fn(),
      concepts: [concepts],
      filteredClass: ['Diagnosis'],
      filteredSources: ['CIEL'],
      loading: false,
    };
    const wrapper = mount(<Router>
      <DictionaryConcepts {...props} />
    </Router>);
    const event = { target: { name: 'searchInput', value: 'ciel' } };
    wrapper.find('#search-concept').simulate('change', event);
    wrapper.find('.searchConcepts').simulate('submit', {
      preventDefault: () => {},
    });
  });

  it('should remove a dictionary concept', () => {
    const props = {
      match: {
        params: {
          typeName: 'dev-col',
          collectionName: 'coreconcepts',
          type: 'users',
          dictionaryName: 'coreconcepts',
        },
      },
      location: {
        pathname: '/random/path',
      },
      fetchDictionaryConcepts: jest.fn(),
      concepts: [concepts],
      filteredClass: ['Diagnosis'],
      filteredSources: ['CIEL'],
      loading: false,
      totalConceptCount: 11,
      filterBySource: jest.fn(),
      filterByClass: jest.fn(),
      paginateConcepts: jest.fn(),
      fetchMemberStatus: jest.fn(),
      userIsMember: jest.fn(),
      removeDictionaryConcept: jest.fn(),
    };

    const wrapper = mount(<Provider store={store}><Router>
      <DictionaryConcepts {...props} />
    </Router></Provider>);
    expect(wrapper).toBeDefined();
    wrapper.find('.btn.btn-sm.mb-1.actionButtons').simulate('click');
    wrapper.find('.btn.btn-danger').simulate('click');
    expect(wrapper).toMatchSnapshot();
  });

  it('should filter search result', () => {
    const props = {
      match: {
        params: {
          typeName: 'dev-col',
        },
      },
      location: {
        pathname: '/random/path',
      },
      fetchDictionaryConcepts: jest.fn(),
      concepts: [concepts],
      filteredClass: ['Diagnosis'],
      filteredSources: ['CIEL'],
      loading: false,
    };
    const wrapper = mount(<Provider store={store}><Router>
      <DictionaryConcepts {...props} />
    </Router></Provider>);
    const event = { target: { name: 'CIEL', checked: true, value: 'ciel' } };
    wrapper.find('#CIEL').simulate('change', event);
    wrapper.find('#Diagnosis').simulate('change', event);
  });

  it('should test componentWillReceiveProps', () => {
    const props = {
      match: {
        params: {
          typeName: 'dev-col',
        },
      },
      location: {
        pathname: '/random/path',
      },
      fetchDictionaryConcepts: jest.fn(),
      concepts: [concepts],
      filteredClass: ['Diagnosis'],
      filteredSources: ['CIEL'],
      loading: false,
    };
    const app = shallow(<DictionaryConcepts {...props} />);
    const newProps = {
      concepts: [concepts],
    };

    app.setState({ searchInput: 'ciel' });
    app.setProps(newProps);
  });

  it('should test mapStateToProps', () => {
    const initialState = {
      concepts: {
        loading: false,
        dictionaryConcepts: [],
        paginatedConcepts: [],
        filteredSources: [],
        filteredClass: [],
      },
      dictionaries: {
        dictionary: [],
      },
      user: {
        userIsMember: false,
      },
    };
    expect(mapStateToProps(initialState).concepts).toEqual([]);
    expect(mapStateToProps(initialState).filteredClass).toEqual([]);
    expect(mapStateToProps(initialState).filteredSources).toEqual([]);
    expect(mapStateToProps(initialState).loading).toEqual(false);
    expect(mapStateToProps(initialState).dictionaries).toEqual([]);
  });
  it('should handle concept pagination', () => {
    const props = {
      match: {
        params: {
          typeName: 'dev-col',
        },
      },
      location: {
        pathname: '/random/path',
      },
      fetchDictionaryConcepts: jest.fn(),
      concepts: [concepts, ...multipleConceptsMockStore.concepts.dictionaryConcepts],
      filteredClass: ['Diagnosis'],
      filteredSources: ['CIEL'],
      loading: false,
      paginateConcepts: jest.fn(),
      totalConceptCount: 21,
    };
    const wrapper = mount(<Router>
      <DictionaryConcepts {...props} />
    </Router>);
    wrapper.find('#next').simulate('click');
    wrapper.find('#previous').simulate('click');
  });
});
