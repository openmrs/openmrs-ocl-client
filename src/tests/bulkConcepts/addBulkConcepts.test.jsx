import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createMockStore } from 'redux-test-utils';
import Authenticated from '../__mocks__/fakeStore';
import { AddBulkConcepts } from '../../components/bulkConcepts/addBulkConcepts';
import { multipleConceptsMockStore } from '../__mocks__/concepts';

const store = createMockStore(Authenticated);
const match = { params: { type: 'users', typeName: 'mochu', collectionName: 'andela' } };
describe('Add Bulk Concepts', () => {
  it('Should render without crashing', () => {
    const props = {
      fetchCielConcepts: jest.fn(),
      cielConcepts: [],
      isFetching: true,
      match,
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
  it('it calls hanldleSelect and add concept', () => {
    const props = {
      fetchCielConcepts: jest.fn(),
      addExistingBulkConcepts: jest.fn(),
      cielConcepts: multipleConceptsMockStore.concepts.dictionaryConcepts,
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
        value: ['/users/nesh/collections/test/concepts/'],
        checked: true,
      },
    };

    const spy = jest.spyOn(wrapper.find('AddBulkConcepts').instance(), 'handleSelect');
    wrapper.instance().forceUpdate();
    wrapper.find('#ciel').at(0).simulate('click');
    wrapper.find('.table-check').at(0).simulate('change', event);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('it calls hanldleSelect and remove a concept', () => {
    const props = {
      fetchCielConcepts: jest.fn(),
      addExistingBulkConcepts: jest.fn(),
      cielConcepts: multipleConceptsMockStore.concepts.dictionaryConcepts,
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
        value: ['/users/nesh/collections/test/concepts/'],
        checked: false,
      },
    };

    const spy = jest.spyOn(wrapper.find('AddBulkConcepts').instance(), 'handleSelect');
    wrapper.instance().forceUpdate();
    wrapper.find('#ciel').at(0).simulate('click');
    wrapper.find('.table-check').at(0).simulate('change', {
      preventDefault: jest.fn(),
      target: {
        value: ['/users/nesh/collections/test/concepts/'],
        checked: true,
      },
    });
    wrapper.find('.table-check').at(0).simulate('change', event);
    expect(spy).toHaveBeenCalled();
  });

  it('it calls hanldleBack', () => {
    const props = {
      fetchCielConcepts: jest.fn(),
      addExistingBulkConcepts: jest.fn(),
      cielConcepts: multipleConceptsMockStore.concepts.dictionaryConcepts,
      isFetching: true,
      match,
    };
    const wrapper = mount(<MemoryRouter>
      <Provider store={store}>
        <AddBulkConcepts {...props} />
      </Provider>
    </MemoryRouter>);
    const spy = jest.spyOn(wrapper.find('AddBulkConcepts').instance(), 'handleBack');
    wrapper.instance().forceUpdate();
    wrapper.find('.btn.btn-secondary.btn-bulk-cancel').at(0).simulate('click');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('it calls hanldleAddAll and add a concept', () => {
    const props = {
      fetchCielConcepts: jest.fn(),
      addExistingBulkConcepts: jest.fn(),
      cielConcepts: multipleConceptsMockStore.concepts.dictionaryConcepts,
      isFetching: true,
      match,
    };
    const event = {
      preventDefault: jest.fn(),
      target: {
        value: ['/users/nesh/collections/test/concepts/'],
        checked: true,
      },
    };
    const wrapper = mount(<MemoryRouter>
      <Provider store={store}>
        <AddBulkConcepts {...props} />
      </Provider>
    </MemoryRouter>);
    const spy = jest.spyOn(wrapper.find('AddBulkConcepts').instance(), 'handleAddAll');
    wrapper.instance().forceUpdate();
    wrapper.find('#ciel').at(0).simulate('click');
    wrapper.find('.table-check').at(0).simulate('change', event);
    wrapper.find('.btn.btn-primary.btn-add-all').at(0).simulate('click');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('it calls hanldlePaginationClick', () => {
    const props = {
      fetchCielConcepts: jest.fn(),
      addExistingBulkConcepts: jest.fn(),
      cielConcepts: multipleConceptsMockStore.concepts.dictionaryConcepts,
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
});

