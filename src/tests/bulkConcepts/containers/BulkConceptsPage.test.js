import React from 'react';

import { mount } from 'enzyme';
import Router from 'react-mock-router';
import {
  BulkConceptsPage,
  mapStateToProps,
} from '../../../components/bulkConcepts/container/BulkConceptsPage';
import concepts from '../../__mocks__/concepts';

jest.useFakeTimers();

jest.mock('react-notify-toast');

describe('Test suite for BulkConceptsPage component', () => {
  it('should render without breaking', () => {
    const props = {
      fetchBulkConcepts: jest.fn(),
      filterConcept: jest.fn(),
      concepts: [],
      loading: true,
      datatypes: [],
      classes: [],
      conceptLimit: 10,
      match: {
        params: {
          type: 'users',
          typeName: 'emasys',
          collectionName: 'dev-org',
          language: 'en',
          dictionaryName: 'CIEL',
        },
      },
      addToFilterList: jest.fn(),
      fetchFilteredConcepts: jest.fn(),
      addConcept: jest.fn(),
      previewConcept: jest.fn(),
    };
    const wrapper = mount(<Router>
      <BulkConceptsPage {...props} />
    </Router>);
    expect(wrapper.find('h4').text()).toEqual('Add CIEL concepts');

    expect(wrapper).toMatchSnapshot();
  });
  it('should render without concepts', () => {
    const props = {
      fetchBulkConcepts: jest.fn(),
      filterConcept: jest.fn(),
      concepts: [],
      loading: false,
      datatypes: [],
      classes: [],
      match: {
        params: {
          type: 'users',
          typeName: 'emasys',
          collectionName: 'dev-org',
          language: 'en',
          dictionaryName: 'CIEL',
        },
      },
      addToFilterList: jest.fn(),
      fetchFilteredConcepts: jest.fn(),
      addConcept: jest.fn(),
      previewConcept: jest.fn(),

    };
    const wrapper = mount(<Router>
      <BulkConceptsPage {...props} />
    </Router>);
    expect(wrapper.find('#emptyConcept').text()).toEqual('No concepts found');
  });

  it('should search for concepts', () => {
    const props = {
      fetchBulkConcepts: jest.fn(),
      fetchFilteredConcepts: jest.fn(),
      filterConcept: jest.fn(),
      handleSearch: jest.fn(),
      handleChange: jest.fn(),
      inputValue: '',
      concepts: [concepts],
      loading: false,
      datatypes: ['text'],
      classes: ['Diagnosis'],
      match: {
        params: {
          type: 'users',
          typeName: 'emasys',
          collectionName: 'dev-org',
          language: 'en',
          dictionaryName: 'CIEL',
        },
      },
      addToFilterList: jest.fn(),
      addConcept: jest.fn(),
      previewConcept: jest.fn(),
    };
    const wrapper = mount(<Router>
      <BulkConceptsPage {...props} />
    </Router>);
    const event = { target: { name: 'searchInput', value: '   testing' } };
    wrapper.find('#search-concept').simulate('change', event);
    wrapper.find('#submit-search-form').simulate('submit');

    const event2 = { target: { name: 'searchInput', value: 'testing' } };
    wrapper.find('#search-concept').simulate('change', event2);
    wrapper.find('#submit-search-form').simulate('submit');

    const clearForm = { target: { name: 'searchInput', value: '' } };
    wrapper.find('#search-concept').simulate('change', clearForm);
  });

  it('should filter search result', () => {
    const props = {
      fetchBulkConcepts: jest.fn(),
      filterConcept: jest.fn(),
      concepts: [concepts],
      loading: false,
      datatypes: ['text'],
      classes: ['Diagnosis'],
      match: {
        params: {
          type: 'users',
          typeName: 'emasys',
          collectionName: 'dev-org',
          language: 'en',
          dictionaryName: 'CIEL',
        },
      },
      addToFilterList: jest.fn(),
      addConcept: jest.fn(),
      previewConcept: jest.fn(),
      fetchFilteredConcepts: jest.fn(),
    };
    const wrapper = mount(<Router>
      <BulkConceptsPage {...props} />
    </Router>);
    const event = { target: { name: 'Diagnosis, datatype', checked: true } };
    const event2 = { target: { name: 'Diagnosis, datatype', checked: true } };
    wrapper.find('#text').simulate('change', event2);
    wrapper.find('#Diagnosis').simulate('change', event);
  });

  it('should filter concepts in the table', () => {
    const props = {
      fetchBulkConcepts: jest.fn(),
      filterConcept: jest.fn(),
      concepts: [concepts],
      loading: false,
      datatypes: ['text'],
      classes: ['Diagnosis'],
      match: {
        params: {
          type: 'users',
          typeName: 'emasys',
          collectionName: 'dev-org',
          language: 'en',
          dictionaryName: 'CIEL',
        },
      },
      addToFilterList: jest.fn(),
      addConcept: jest.fn(),
      previewConcept: jest.fn(),
      fetchFilteredConcepts: jest.fn(),
    };
    const wrapper = mount(<Router>
      <BulkConceptsPage {...props} />
    </Router>);
    const event = {
      target: {
        value: 'malaria',
      },
    };
    const bulkConceptsWrapper = wrapper.find('BulkConceptsPage').instance();
    const spy = jest.spyOn(bulkConceptsWrapper, 'filterCaseInsensitive');
    bulkConceptsWrapper.forceUpdate();
    wrapper.find('ReactTable').find('input').at(0).simulate('change', event);
    expect(spy).toHaveBeenCalled();
  });

  it('should simulate clicks on action buttons', () => {
    const props = {
      fetchBulkConcepts: jest.fn(),
      concepts: [concepts],
      loading: false,
      datatypes: ['text'],
      classes: ['Diagnosis'],
      match: {
        params: {
          type: 'users',
          typeName: 'emasys',
          collectionName: 'dev-org',
          language: 'en',
          dictionaryName: 'CIEL',
        },
      },
      addToFilterList: jest.fn(),
      preview: {
        url: 'dsa',
        display_name: 'asd',
      },
      addConcept: jest.fn(),
      previewConcept: jest.fn(),
      fetchFilteredConcepts: jest.fn(),
    };
    const wrapper = mount(<Router>
      <BulkConceptsPage {...props} />
    </Router>);
    wrapper.find('#add-button').simulate('click');
    jest.runAllTimers();
  });

  it('should test mapStateToProps', () => {
    const initialState = {
      concepts: {
        loading: false,
      },
      bulkConcepts: {
        bulkConcepts: [],
        datatypes: [],
        classes: [],
        preview: [],
      },
    };
    expect(mapStateToProps(initialState).concepts).toEqual([]);
    expect(mapStateToProps(initialState).datatypes).toEqual([]);
    expect(mapStateToProps(initialState).classes).toEqual([]);
    expect(mapStateToProps(initialState).preview).toEqual([]);
    expect(mapStateToProps(initialState).loading).toEqual(false);
  });
});
