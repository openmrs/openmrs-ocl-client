import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createMockStore } from 'redux-test-utils';
import Authenticated from '../../__mocks__/fakeStore';
import {
  ConceptSearch,
  mapStateToProps,
} from '../../../components/dashboard/container/Concepts';
import concepts from '../../__mocks__/concepts';

jest.mock('../../../components/dashboard/components/dictionary/AddDictionary');

const store = createMockStore(Authenticated);
describe('Dashboard Concept Component', () => {
  it('should render without crashing', () => {
    const props = {
      fetchConceptsAction: jest.fn(),
      concepts: [],
      isFetching: false,
    };
    const wrapper = mount(<MemoryRouter>
      <Provider store={store}>
        <ConceptSearch {...props} />
      </Provider>
    </MemoryRouter>);

    expect(wrapper).toMatchSnapshot();
  });
  it('should render preloader spinner', () => {
    const props = {
      fetchConceptsAction: jest.fn(),
      concepts: [],
      isFetching: true,
    };
    const wrapper = mount(<MemoryRouter>
      <Provider store={store}>
        <ConceptSearch {...props} />
      </Provider>
    </MemoryRouter>);

    expect(wrapper).toMatchSnapshot();
  });
  it('should search for a concept', () => {
    const props = {
      fetchConceptsAction: jest.fn(),
      concepts: [concepts],
      isFetching: true,
    };
    const wrapper = mount(<MemoryRouter>
      <Provider store={store}>
        <ConceptSearch {...props} />
      </Provider>
    </MemoryRouter>);
    const event = { target: { name: 'searchInput', value: 'ciel' } };
    wrapper.find('#search').simulate('change', event);
    wrapper.find('.search-bar-wrapper').simulate('submit', {
      preventDefault: () => {},
    });
  });

  it('should test mapStateToProps', () => {
    const initialState = {
      concepts: { concepts: [], loading: false },
    };
    expect(mapStateToProps(initialState).concepts).toEqual([]);
    expect(mapStateToProps(initialState).isFetching).toEqual(false);
  });
  it('should render with concepts', () => {
    const props = {
      fetchConceptsAction: jest.fn(),
      concepts: [concepts],
      isFetching: true,
    };
    const wrapper = mount(<MemoryRouter>
      <Provider store={store}>
        <ConceptSearch {...props} />
      </Provider>
    </MemoryRouter>);
    expect(wrapper).toMatchSnapshot();
  });
});
