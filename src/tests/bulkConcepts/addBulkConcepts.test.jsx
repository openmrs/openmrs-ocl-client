import React from 'react';
import { mount, shallow } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createMockStore } from 'redux-test-utils';
import Authenticated from '../__mocks__/fakeStore';
import { mapStateToProps, AddBulkConcepts } from '../../components/bulkConcepts/addBulkConcepts';
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
      isFetching: false,
      match,
      addExistingBulkConcepts: jest.fn(),
      language: 'en',
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
      isFetching: false,
      match,
      addExistingBulkConcepts: jest.fn(),
      language: 'en',
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
      isFetching: false,
      match,
      language: 'en',
    };
    const wrapper = mount(<MemoryRouter>
      <Provider store={store}>
        <AddBulkConcepts {...props} />
      </Provider>
    </MemoryRouter>);
    wrapper.find('#btn-add-all').at(0).simulate('click');
  });
  it('enables the Add all button when a concept is selected', () => {
    const props = {
      fetchCielConcepts: jest.fn(),
      addExistingBulkConcepts: jest.fn(),
      cielConcepts: [],
      isFetching: false,
      match,
      language: 'en',
    };
    const wrapper = shallow(<AddBulkConcepts {...props} />);
    wrapper.setState({
      cielConcepts: [{
        'concept-url': 'random',
      }],
    });
    expect(wrapper.find('.btn-add-all').length).toBe(1);
  });

  it('should test mapStateToProps', () => {
    const initialState = {
      cielConcepts: {
        cielConcepts: ['1'],
      },
    };
    expect(mapStateToProps(initialState).cielConcepts).toEqual(['1']);
  });
});
