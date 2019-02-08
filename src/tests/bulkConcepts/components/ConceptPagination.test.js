import React from 'react';
import { shallow } from 'enzyme';
import ConceptPagination from '../../../components/bulkConcepts/component/ConceptPagination';
import concepts from '../../__mocks__/concepts';

jest.useFakeTimers();

jest.mock('react-notify-toast');

describe('Test suite for ConceptPagination component', () => {
  it('it should call the handle getLastPage function', () => {
    const props = {
      setCurrentPage: jest.fn(),
      currentPage: 1,
      fetchBulkConcepts: jest.fn(),
      filterConcept: jest.fn(),
      data: [concepts],
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
      showFrom: jest.fn(),
      showTo: jest.fn(),
      getLastPage: jest.fn(),
      limitCount: 10,
    };
    const wrapper = shallow(<ConceptPagination {...props} />);
    const instance = wrapper.instance();
    expect(instance.getLastPage()).toEqual(1);
  });
  it('it should return showPagination function as false', () => {
    const props = {
      setCurrentPage: jest.fn(),
      currentPage: 1,
      data: [concepts],
      addToFilterList: jest.fn(),
      addConcept: jest.fn(),
      previewConcept: jest.fn(),
      fetchFilteredConcepts: jest.fn(),
      showFrom: jest.fn(),
      showTo: jest.fn(),
      getLastPage: jest.fn(),
      showPagination: jest.fn(),
      limitCount: 10,
    };
    const wrapper = shallow(<ConceptPagination {...props} />);
    const instance = wrapper.instance();
    expect(instance.showPagination()).toEqual(false);
  });
  it('it should return showPagination function as true', () => {
    const props = {
      setCurrentPage: jest.fn(),
      currentPage: 2,
      data: [concepts],
      addToFilterList: jest.fn(),
      addConcept: jest.fn(),
      previewConcept: jest.fn(),
      fetchFilteredConcepts: jest.fn(),
      showFrom: jest.fn(),
      showTo: jest.fn(),
      getLastPage: jest.fn(),
      showPagination: jest.fn(),
      limitCount: 10,
    };
    const wrapper = shallow(<ConceptPagination {...props} />);
    const instance = wrapper.instance();
    expect(instance.showPagination()).toEqual(true);
  });
  it('it should call the handle getLastPage when concepts is up to ten', () => {
    const props = {
      setCurrentPage: jest.fn(),
      currentPage: 1,
      fetchBulkConcepts: jest.fn(),
      filterConcept: jest.fn(),
      data: [{ id: '1' }, { id: '2' },
        { id: '3' }, { id: '4' },
        { id: '5' }, { id: '6' },
        { id: '7' }, { id: '8' },
        { id: '9' }, { id: '10' }],
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
      showFrom: jest.fn(),
      showTo: jest.fn(),
      getLastPage: jest.fn(),
      limitCount: 10,
    };
    const wrapper = shallow(<ConceptPagination {...props} />);
    const instance = wrapper.instance();
    expect(instance.getLastPage()).toEqual(2);
  });
  it('it should call the handle showTo function', () => {
    const props = {
      setCurrentPage: jest.fn(),
      currentPage: 1,
      fetchBulkConcepts: jest.fn(),
      filterConcept: jest.fn(),
      data: [concepts],
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
      showFrom: jest.fn(),
      showTo: jest.fn(),
      getLastPage: jest.fn(),
      limitCount: 10,
    };
    const wrapper = shallow(<ConceptPagination {...props} />).setState({ limit: 10 });
    const instance = wrapper.instance();
    expect(instance.showTo()).toEqual(1);
  });
  it('it should call the handle showFrom function', () => {
    const props = {
      setCurrentPage: jest.fn(),
      currentPage: 1,
      fetchBulkConcepts: jest.fn(),
      filterConcept: jest.fn(),
      data: [concepts],
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
      showFrom: jest.fn(),
      showTo: jest.fn(),
      getLastPage: jest.fn(),
      limitCount: 10,
    };
    const wrapper = shallow(<ConceptPagination {...props} />).setState({ limit: 10 });
    const instance = wrapper.instance();
    expect(instance.showFrom()).toEqual(1);
  });
});
