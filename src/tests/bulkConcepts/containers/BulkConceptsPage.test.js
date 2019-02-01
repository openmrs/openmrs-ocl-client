import React from 'react';
import { mount, shallow } from 'enzyme';
import Router from 'react-mock-router';
import { createMockStore } from 'redux-test-utils';
import { Provider } from 'react-redux';
import {
  BulkConceptsPage,
  mapStateToProps,
} from '../../../components/bulkConcepts/container/BulkConceptsPage';
import concepts from '../../__mocks__/concepts';

const store = createMockStore({
  bulkConcepts: {
    bulkConcepts: [],
    currentPage: 1,
  },
});
jest.useFakeTimers();

jest.mock('react-notify-toast');

describe('Test suite for BulkConceptsPage component', () => {
  it('should render without breaking', () => {
    const props = {
      setCurrentPage: jest.fn(),
      currentPage: 1,
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
      setCurrentPage: jest.fn(),
      currentPage: 1,
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
    const wrapper = mount(<Provider store={store}>
      <Router>
        <BulkConceptsPage {...props} />
      </Router>
    </Provider>);
    expect(wrapper.find('.rt-noData').text()).toEqual('No concepts found!');
  });
  it('should render a loader', () => {
    const props = {
      setCurrentPage: jest.fn(),
      currentPage: 1,
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
      handleNextPage: jest.fn(),
    };
    const wrapper = mount(<Provider store={store}>
      <Router>
        <BulkConceptsPage {...props} />
      </Router>
    </Provider>);
    expect(wrapper.find('Loader')).toHaveLength(1);
  });

  it('it should call the handle handleNextPage function', () => {
    const props = {
      setCurrentPage: jest.fn(),
      currentPage: 1,
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
      handleNextPage: jest.fn(),
    };
    const wrapper = shallow(<BulkConceptsPage {...props} />);
    const event = {
      preventDefault: jest.fn(),
      target: {
        id: 1,
      },
    };
    const instance = wrapper.instance();
    expect(instance.handleNextPage(event)).toEqual(undefined);
  });
  it('it should call the handle handleNextPage function while searching', () => {
    const props = {
      setCurrentPage: jest.fn(),
      currentPage: 1,
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
      handleNextPage: jest.fn(),
    };
    const wrapper = shallow(<BulkConceptsPage {...props} />).setState({ searchingOn: true });
    const event = {
      preventDefault: jest.fn(),
      target: {
        id: 1,
      },
    };
    const instance = wrapper.instance();
    expect(instance.handleNextPage(event)).toEqual(undefined);
  });

  it('it should call searchingOn state should be available', () => {
    const props = {
      setCurrentPage: jest.fn(),
      currentPage: 1,
      searchingOn: true,
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
      handleNextPage: jest.fn(),
    };
    const wrapper = mount(<Provider store={store}>
      <Router>
        <BulkConceptsPage {...props} />
      </Router>
    </Provider>);
    const event = {
      preventDefault: jest.fn(),
      target: {
        id: 1,
      },
    };
    wrapper.find('BulkConceptsPage').instance().setState({
      searchingOn: true,
    });

    wrapper.find('BulkConceptsPage').instance().handleNextPage(event);
    const showState = wrapper.find('BulkConceptsPage').instance().state.searchingOn;
    expect(showState).toEqual(true);
  });

  it('it should call the handle componentDidUpdate function', () => {
    const props = {
      setCurrentPage: jest.fn(),
      currentPage: 1,
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
      handleNextPage: jest.fn(),
      componentDidUpdate: jest.fn(),
    };
    const wrapper = shallow(<BulkConceptsPage {...props} />);
    const instance = wrapper.instance();
    expect(instance.componentDidUpdate(2)).toEqual(undefined);
  });

  it('it should call the handle componentDidMount function', () => {
    const props = {
      setCurrentPage: jest.fn(),
      currentPage: 1,
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
      handleNextPage: jest.fn(),
      componentDidMount: jest.fn(),
    };
    const wrapper = shallow(<BulkConceptsPage {...props} />);
    const instance = wrapper.instance();
    expect(instance.componentDidMount()).toEqual(undefined);
  });

  it('it should call the handle componentDidUpdate function while searching', () => {
    const props = {
      setCurrentPage: jest.fn(),
      currentPage: 1,
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
      handleNextPage: jest.fn(),
      componentDidUpdate: jest.fn(),
    };
    const wrapper = shallow(<BulkConceptsPage {...props} />).setState({ searchingOn: true });
    const instance = wrapper.instance();
    expect(instance.componentDidUpdate(2)).toEqual(undefined);
  });

  it('should refresh page when search input is empty', () => {
    const props = {
      setCurrentPage: jest.fn(),
      currentPage: 1,
      searchingOn: true,
      fetchBulkConcepts: jest.fn(),
      getBulkConcepts: jest.fn(),
      bulkConceptsFetched: jest.fn(),
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
      handleNextPage: jest.fn(),
    };
    const wrapper = mount(<Router>
      <Provider store={store}>
        <BulkConceptsPage {...props} />
      </Provider>
    </Router>);
    const Wrapper = wrapper.find('BulkConceptsPage').instance();
    const spy = jest.spyOn(Wrapper.props, 'fetchBulkConcepts');
    Wrapper.forceUpdate();
    wrapper.update();
    const event = { target: { name: 'searchInput', value: '' } };
    wrapper.find('#search-concept').simulate('change', event);
    expect(spy).toHaveBeenCalled();
  });

  it('should search for concepts', () => {
    const props = {
      setCurrentPage: jest.fn(),
      currentPage: 1,
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
    const wrapper = mount(<Provider store={store}>
      <Router>
        <BulkConceptsPage {...props} />
      </Router>
    </Provider>);
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
      setCurrentPage: jest.fn(),
      currentPage: 1,
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
    const wrapper = mount(<Provider store={store}>
      <Router>
        <BulkConceptsPage {...props} />
      </Router>
    </Provider>);
    const event = { target: { name: 'Diagnosis, datatype', checked: true } };
    const event2 = { target: { name: 'Diagnosis, datatype', checked: true } };
    wrapper.find('#text').simulate('change', event2);
    wrapper.find('#Diagnosis').simulate('change', event);
  });

  it('should filter search result with datatype', () => {
    const props = {
      setCurrentPage: jest.fn(),
      currentPage: 1,
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
    const wrapper = mount(<Provider store={store}>
      <Router>
        <BulkConceptsPage {...props} />
      </Router>
    </Provider>);
    let event = { target: { name: 'Diagnosis, datatype', checked: true } };
    wrapper.find('#Diagnosis').simulate('change', event);
    event = { target: { name: 'Diagnosis, classes', checked: true } };
    wrapper.find('#Diagnosis').simulate('change', event);
    expect(wrapper.find('BulkConceptsPage').props().addToFilterList).toHaveBeenCalledTimes(2);
  });

  it('should simulate clicks on action buttons', () => {
    const props = {
      setCurrentPage: jest.fn(),
      currentPage: 1,
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
    const wrapper = mount(<Provider store={store}>
      <Router>
        <BulkConceptsPage {...props} />
      </Router>
    </Provider>);
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
