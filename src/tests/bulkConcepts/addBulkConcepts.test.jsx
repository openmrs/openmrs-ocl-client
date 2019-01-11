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
  const props = {
    fetchCielConcepts: jest.fn(),
    addExistingBulkConcepts: jest.fn(),
    cielConcepts: mockConcepts,
    isFetching: false,
    match,
    language: 'en',
  };

  beforeEach(() => {
    localStorage.setItem('dictionaryName', 'OpenMRS');
  });

  it('Should render without crashing', () => {
    const wrapper = mount(<MemoryRouter>
      <Provider store={store}>
        <AddBulkConcepts {...props} />
      </Provider>
    </MemoryRouter>);
    expect(wrapper.length).toEqual(1);
  });

  it('calls the handleClick function when the CIEL radio button is clicked', () => {
    const wrapper = mount(<MemoryRouter>
      <Provider store={store}>
        <AddBulkConcepts {...props} />
      </Provider>
    </MemoryRouter>);
    const bulkWrapper = wrapper.find('AddBulkConcepts').instance();
    const spy = jest.spyOn(bulkWrapper, 'handleCielClick');
    bulkWrapper.forceUpdate();
    wrapper.find('#ciel').at(0).simulate('click');
    expect(spy).toHaveBeenCalled();
  });

  it('shows suggestions when typing', () => {
    const hasMenu = wrapper => wrapper.find('#search-ul').length === 1;

    const wrapper = mount(<MemoryRouter>
      <Provider store={store}>
        <AddBulkConcepts {...props} />
      </Provider>
    </MemoryRouter>);
    wrapper.find('#search').simulate('keydown', { key: 'ArrowDown' });
    expect(hasMenu(wrapper)).toBe(true);
  });

  it('can search for and select "Bronze ..."', () => {
    const wrapper = mount(<MemoryRouter>
      <Provider store={store}>
        <AddBulkConcepts {...props} />
      </Provider>
    </MemoryRouter>);
    const input = wrapper.find('#search');
    input.simulate('change', { target: { value: '' } });
    input.simulate('keydown', { key: 'ArrowDown' });
    input.simulate('keydown', { key: 'Enter' });
    expect(input.instance().value).toEqual('Bronze Diabetes');
    const txtInput = wrapper.find('#idsText').at(0);
    expect(txtInput.instance().props.value).toEqual('1');
  });

  it('can search for concept that does not exist', () => {
    const wrapper = mount(<MemoryRouter>
      <Provider store={store}>
        <AddBulkConcepts {...props} />
      </Provider>
    </MemoryRouter>);
    const input = wrapper.find('#search');
    input.simulate('change', { target: { value: 'non existent' } });
    input.simulate('keydown', { key: 'ArrowDown' });
    input.simulate('keydown', { key: 'Enter' });
    const txtInput = wrapper.find('#idsText').at(0);
    expect(txtInput.instance().props.value).toEqual('');
  });

  it('adding ides to already existing conceptIds should prepend commer', () => {
    const wrapper = mount(<MemoryRouter>
      <Provider store={store}>
        <AddBulkConcepts {...props} />
      </Provider>
    </MemoryRouter>);
    const component = wrapper.find('AddBulkConcepts').instance();
    component.handleSelected({ id: 12 });
    expect(component.state.conceptIds).toEqual(12);
    component.handleSelected({ id: 99 });
    expect(component.state.conceptIds).toEqual('12, 99');
  });

  it('simulate textarea text change', () => {
    const wrapper = mount(<MemoryRouter>
      <Provider store={store}>
        <AddBulkConcepts {...props} />
      </Provider>
    </MemoryRouter>);

    const txtInput = wrapper.find('#idsText').at(0);
    const bulkWrapper = wrapper.find('AddBulkConcepts').instance();
    bulkWrapper.forceUpdate();

    txtInput.simulate('change', { target: { value: '8,8,89' } });
    txtInput.simulate('keydown', { key: 'Enter' });
    expect(bulkWrapper.state.conceptIds).toEqual('8,8,89');
  });
});
