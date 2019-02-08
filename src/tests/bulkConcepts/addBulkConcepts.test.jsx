import React from 'react';
import { mount, shallow } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import moxios from 'moxios';
import { createMockStore } from 'redux-test-utils';
import Authenticated from '../__mocks__/fakeStore';
import { AddBulkConcepts, mapStateToProps } from '../../components/bulkConcepts/addBulkConcepts';
import { mockConcepts } from '../__mocks__/concepts';
import configInstance from '../../config/axiosConfig';

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
    fetchSourceConcepts: jest.fn(),
    addExistingBulkConcepts: jest.fn(),
    fetchConceptSources: jest.fn(),
    sourceConcepts: mockConcepts,
    conceptSources: [{ id: 1, name: 'testSource', url: '/org/testSource/' },
      { id: 2, name: 'testSource', url: '/org/testSource/' }],
    isFetching: false,
    match,
    language: 'en',
    isLoading: true,
  };

  beforeEach(() => {
    localStorage.setItem('dictionaryName', 'OpenMRS');
    moxios.install(configInstance);
  });

  afterEach(() => {
    moxios.uninstall(configInstance);
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

  it('should render a loader while fetching Source Concepts', () => {
    const wrapper = mount(<MemoryRouter>
      <Provider store={store}>
        <AddBulkConcepts {...props} />
      </Provider>
    </MemoryRouter>);
    expect(wrapper.find('Loader')).toHaveLength(1);
  });

  it('should render a loader while fetching Concepts Source', () => {
    const properties = {
      fetchSourceConcepts: jest.fn(),
      addExistingBulkConcepts: jest.fn(),
      fetchConceptSources: jest.fn(),
      sourceConcepts: mockConcepts,
      conceptSources: [{ id: 1, name: 'testSource', url: '/org/testSource/' },
        { id: 2, name: 'testSource', url: '/org/testSource/' }],
      isFetching: true,
      isLoading: false,
      match,
      language: 'en',
    };
    const wrapper = mount(<MemoryRouter>
      <Provider store={store}>
        <AddBulkConcepts {...properties} />
      </Provider>
    </MemoryRouter>);
    expect(wrapper.find('Loader')).toHaveLength(1);
  });

  it('shows suggestions when typing', () => {
    const hasMenu = wrapper => wrapper.find('.search-ul').at(0).length === 1;

    const wrapper = mount(<MemoryRouter>
      <Provider store={store}>
        <AddBulkConcepts {...props} />
      </Provider>
    </MemoryRouter>);
    wrapper.find('#search').simulate('keydown', { key: 'ArrowDown' });
    expect(hasMenu(wrapper)).toBe(true);
  });

  it('can search for and select "Bronze ..." in concepts', () => {
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

  it('should call addExistingBulkConcepts on handleAll click', () => {
    const wrapper = mount(<MemoryRouter>
      <Provider store={store}>
        <AddBulkConcepts {...props} />
      </Provider>
    </MemoryRouter>);
    const component = wrapper.find('AddBulkConcepts').instance();
    const spy = jest.spyOn(component, 'handleAddAll');
    component.forceUpdate();
    const addAllButton = wrapper.find('#btn-add-all').at(0);
    component.handleAddAll();

    moxios.stubRequest('https://api.qa.openconceptlab.org/orgs/CIEL/sources/CIEL/concepts/1/', {
      status: 200,
      response: { id: 1, retired: false, name: 'something random' },
    });
    moxios.stubRequest('https://api.qa.openconceptlab.org/orgs/CIEL/sources/CIEL/concepts/44/', {
      status: 404,
      response: { error: 'not done' },
    });

    component.handleSelected({ id: '1, 44' });
    addAllButton.simulate('click');

    moxios.wait(() => {
      expect(spy).toHaveBeenCalled();
      wrapper.unmount();
    });
  });

  it('handleaAdAll close resultModal on close', () => {
    const wrapper = shallow(
      <AddBulkConcepts {...props} />,
    );
    wrapper.setState({ openResultModal: true });
    expect(wrapper.state().openResultModal).toBe(true);
    const instance = wrapper.instance();
    instance.closeResultModal();
    expect(wrapper.state().openResultModal).toBe(false);
  });

  it('can search for and select "testSource ..." in conceptSources', () => {
    const wrapper = mount(<MemoryRouter>
      <Provider store={store}>
        <AddBulkConcepts {...props} />
      </Provider>
    </MemoryRouter>);
    const other = wrapper.find('#otherSourcesOption');
    other.simulate('click');
    const input = wrapper.find('#sourceSearch');
    input.simulate('change', { target: { value: '' } });
    input.simulate('keydown', { key: 'ArrowDown' });
    input.simulate('keydown', { key: 'Enter' });
    expect(input.instance().value).toEqual('testSource');
    const component = wrapper.find('AddBulkConcepts').instance();
    expect(component.sourceUrl).toEqual('org/testSource/');
  });

  it('can search for sources that does not exist', () => {
    const wrapper = mount(<MemoryRouter>
      <Provider store={store}>
        <AddBulkConcepts {...props} />
      </Provider>
    </MemoryRouter>);
    const other = wrapper.find('#otherSourcesOption');
    other.simulate('click');
    const input = wrapper.find('#sourceSearch');
    input.simulate('change', { target: { value: 'non existent' } });
    input.simulate('keydown', { key: 'ArrowDown' });
    input.simulate('keydown', { key: 'Enter' });
    const txtInput = wrapper.find('#idsText').at(0);
    expect(txtInput.instance().props.value).toEqual('');
  });

  it('should test mapStateToProps', () => {
    const initialState = {
      sourceConcepts: {
        concepts: [],
        conceptSources: [],
        loading: false,
        spinning: false,
      },
    };
    expect(mapStateToProps(initialState).isLoading).toEqual(false);
    expect(mapStateToProps(initialState).isFetching).toEqual(false);
  });
});
