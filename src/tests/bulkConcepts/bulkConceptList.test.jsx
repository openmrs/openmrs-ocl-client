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
    cielConcepts: [existingConcept],
    isFetching: false,
  };
  it('Should render without crashing', () => {
    const wrapper = mount(<MemoryRouter>
      <Provider store={store}>
        <BulkConceptList {...props} />
      </Provider>
    </MemoryRouter>);
    expect(wrapper).toMatchSnapshot();
  });
});
