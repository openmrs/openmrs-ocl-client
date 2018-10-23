import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createMockStore } from 'redux-test-utils';
import Authenticated from '../__mocks__/fakeStore';
import { AddBulkConcepts } from '../../components/bulkConcepts/addBulkConcepts';

const store = createMockStore(Authenticated);
describe('Add Bulk Concepts', () => {
  beforeEach(() => {
    localStorage.setItem('dictionaryName', 'OpenMRS');
  });
  it('Should render without crashing', () => {
    const props = {
      fetchCielConcepts: jest.fn(),
      cielConcepts: [],
      isFetching: true,
      match: {
        params: {
          type: 'users',
          typeName: 'mochu',
          collectionName: 'andela',
          language: 'en',
          dictionaryName: 'WHO',
        },
      },
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
      match: {
        params: {
          type: 'users',
          typeName: 'mochu',
          collectionName: 'andela',
          language: 'en',
          dictionaryName: 'WHO',
        },
      },
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
      match: {
        params: {
          type: 'users',
          typeName: 'mochu',
          collectionName: 'andela',
          language: 'en',
          dictionaryName: 'WHO',
        },
      },
    };
    const wrapper = mount(<MemoryRouter>
      <Provider store={store}>
        <AddBulkConcepts {...props} />
      </Provider>
    </MemoryRouter>);
    wrapper.find('#btn-add-all').at(0).simulate('click');
  });
});
