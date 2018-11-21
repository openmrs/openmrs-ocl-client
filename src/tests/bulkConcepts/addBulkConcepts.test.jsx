import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createMockStore } from 'redux-test-utils';
import Authenticated from '../__mocks__/fakeStore';
import { AddBulkConcepts } from '../../components/bulkConcepts/addBulkConcepts';
import { mockConcepts } from '../__mocks__/concepts';

const store = createMockStore(Authenticated);
const match = {
  params: {
    type: 'users',
    typeName: 'mochu',
    collectionName: 'andela',
    language: 'en',
    dictionaryName: 'WHO',
  },
};
describe('Add Bulk Concepts', () => {
  beforeEach(() => {
    localStorage.setItem('dictionaryName', 'OpenMRS');
  });
  it('Should render without crashing', () => {
    const props = {
      fetchCielConcepts: jest.fn(),
      cielConcepts: [],
      isFetching: true,
      match,
      addExistingBulkConcepts: jest.fn(),
    };
    const wrapper = mount(<MemoryRouter>
      <Provider store={store}>
        <AddBulkConcepts {...props} />
      </Provider>
    </MemoryRouter>);
    expect(wrapper).toMatchSnapshot();
  });
  it('calls the handleClick function when the CIEL radio button is clicked', () => {
    const props = {
      fetchCielConcepts: jest.fn(),
      cielConcepts: [],
      isFetching: true,
      match,
      addExistingBulkConcepts: jest.fn(),
    };
    const wrapper = mount(<MemoryRouter>
      <Provider store={store}>
        <AddBulkConcepts {...props} />
      </Provider>
    </MemoryRouter>);
    wrapper.find('#ciel').at(0).simulate('click');
  });
  it('calls the handleClick function when the Add all button is clicked', () => {
    const props = {
      fetchCielConcepts: jest.fn(),
      addExistingBulkConcepts: jest.fn(),
      cielConcepts: [],
      isFetching: true,
      match,
    };
    const wrapper = mount(<MemoryRouter>
      <Provider store={store}>
        <AddBulkConcepts {...props} />
      </Provider>
    </MemoryRouter>);
    wrapper.find('#btn-add-all').at(0).simulate('click');
  });
});

it('hanldleSelect is called and add concept', () => {
  const props = {
    fetchCielConcepts: jest.fn(),
    addExistingBulkConcepts: jest.fn(),
    cielConcepts: mockConcepts,
    isFetching: true,
    match,
  };
  const wrapper = mount(<MemoryRouter>
    <Provider store={store}>
      <AddBulkConcepts {...props} />
    </Provider>
  </MemoryRouter>);
  const event = {
    preventDefault: jest.fn(),
    target: {
      value: ['/users/michy/collections/test/concepts/'],
      checked: true,
    },
  };
  const spy = jest.spyOn(wrapper.find('AddBulkConcepts').instance(), 'handleSelect');
  wrapper.instance().forceUpdate();
  wrapper.find('#ciel').at(0).simulate('click');
  wrapper.find('.table-check').at(0).simulate('change', event);
  expect(spy).toHaveBeenCalledTimes(1);
});
it('hanldleSelect is called and remove a concept', () => {
  const props = {
    fetchCielConcepts: jest.fn(),
    addExistingBulkConcepts: jest.fn(),
    cielConcepts: mockConcepts,
    isFetching: true,
    match,
  };
  const wrapper = mount(<MemoryRouter>
    <Provider store={store}>
      <AddBulkConcepts {...props} />
    </Provider>
  </MemoryRouter>);
  const event = {
    preventDefault: jest.fn(),
    target: {
      value: ['/users/michy/collections/test/concepts/'],
      checked: false,
    },
  };
  const spy = jest.spyOn(wrapper.find('AddBulkConcepts').instance(), 'handleSelect');
  wrapper.instance().forceUpdate();
  wrapper.find('#ciel').at(0).simulate('click');
  wrapper.find('.table-check').at(0).simulate('change', {
    preventDefault: jest.fn(),
    target: {
      value: ['/users/michy/collections/test/concepts/'],
      checked: true,
    },
  });
  wrapper.find('.table-check').at(0).simulate('change', event);
  expect(spy).toHaveBeenCalled();
});
it('it should call hanldleAddAll and add a concept', () => {
  const props = {
    fetchCielConcepts: jest.fn(),
    addExistingBulkConcepts: jest.fn(),
    cielConcepts: mockConcepts,
    isFetching: true,
    match,
  };
  const wrapper = mount(<MemoryRouter>
    <Provider store={store}>
      <AddBulkConcepts {...props} />
    </Provider>
  </MemoryRouter>);
  const event = {
    target: {
      value: ['/users/michy/collections/test/concepts/'],
      checked: true,
    },
  };
  const spy = jest.spyOn(wrapper.find('AddBulkConcepts').instance(), 'handleAddAll');
  wrapper.instance().forceUpdate();
  wrapper.find('#ciel').at(0).simulate('click');
  wrapper.find('.table-check').at(0).simulate('change', event);
  wrapper.find('#btn-add-all').simulate('click');
  expect(spy).toHaveBeenCalledTimes(1);
});
it('it calls hanldlePaginationClick', () => {
  const props = {
    fetchCielConcepts: jest.fn(),
    addExistingBulkConcepts: jest.fn(),
    cielConcepts: mockConcepts,
    isFetching: true,
    match,
  };
  const wrapper = mount(<MemoryRouter>
    <Provider store={store}>
      <AddBulkConcepts {...props} />
    </Provider>
  </MemoryRouter>);
  const spy = jest.spyOn(wrapper.find('AddBulkConcepts').instance(), 'handlePaginationClick');
  wrapper.instance().forceUpdate();
  wrapper.find('#ciel').at(0).simulate('click');
  wrapper.find('.fas.fa-angle-double-right.nxt').at(0).simulate('click');
  expect(spy).toHaveBeenCalledTimes(1);
});

it('should filter concepts in the table', () => {
  const props = {
    fetchCielConcepts: jest.fn(),
    addExistingBulkConcepts: jest.fn(),
    cielConcepts: mockConcepts,
    isFetching: true,
    match,
    datatypes: ['text'],
    classes: ['Diagnosis'],
  };
  const wrapper = mount(<MemoryRouter>
    <Provider store={store}>
      <AddBulkConcepts {...props} />
    </Provider>
  </MemoryRouter>);
  const event = {
    target: {
      value: 'malaria',
    },
  };
  const addBulkConceptsWrapper = wrapper.find('AddBulkConcepts').instance();
  const spy = jest.spyOn(addBulkConceptsWrapper, 'filterCaseInsensitive');
  addBulkConceptsWrapper.forceUpdate();
  wrapper.find('ReactTable').find('input').at(0).simulate('change', event);
  expect(spy).toHaveBeenCalled();
});
