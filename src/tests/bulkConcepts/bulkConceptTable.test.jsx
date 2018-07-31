import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createMockStore } from 'redux-test-utils';
import Authenticated from '../__mocks__/fakeStore';
import BulkConceptTable from '../../components/bulkConcepts/bulkConceptTable';
import { existingConcept } from '../__mocks__/concepts';

const store = createMockStore(Authenticated);
describe('Bulk Concept Table', () => {
  const props = {
    concept: existingConcept,
    isFetching: false,
  };
  it('Should render without crashing', () => {
    const wrapper = mount(<MemoryRouter>
      <Provider store={store}>
        <BulkConceptTable {...props} />
      </Provider>
    </MemoryRouter>);
    expect(wrapper).toMatchSnapshot();
  });
});
