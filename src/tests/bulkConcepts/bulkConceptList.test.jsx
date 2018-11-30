import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createMockStore } from 'redux-test-utils';
import Authenticated from '../__mocks__/fakeStore';
import BulkConceptList from '../../components/bulkConcepts/bulkConceptList';
import { existingConcept } from '../__mocks__/concepts';

const store = createMockStore(Authenticated);
describe('Bulk Concepts List', () => {
  const props = {
    fetchCielConcepts: jest.fn(),
    filterConcept: jest.fn(),
    handleSelect: jest.fn(),
    cielConcepts: [existingConcept],
    fetching: false,
    conceptLimit: 10,
  };
  it('Should render without crashing', () => {
    const wrapper = mount(<MemoryRouter>
      <Provider store={store}>
        <BulkConceptList {...props} />
      </Provider>
    </MemoryRouter>);
    expect(wrapper).toMatchSnapshot();
  });
  it('should render when there is no concept', () => {
    const newProps = {
      ...props,
      cielConcepts: [],
    };
    const wrapper = mount(<MemoryRouter>
      <Provider store={store}>
        <BulkConceptList {...newProps} />
      </Provider>
    </MemoryRouter>);
    expect(wrapper.length).toEqual(1);
  });

  it('should render loader', () => {
    const newProps = {
      ...props,
      fetching: true,
      cielConcepts: [],
    };
    const wrapper = mount(<MemoryRouter>
      <Provider store={store}>
        <BulkConceptList {...newProps} />
      </Provider>
    </MemoryRouter>);
    expect(wrapper.length).toEqual(1);
  });
});
