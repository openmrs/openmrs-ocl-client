import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createMockStore } from 'redux-test-utils';
import SpecificConceptTable from '../../../components/dashboard/components/concepts/SpecificConceptTable';
import Authenticated from '../../__mocks__/fakeStore';
import { existingConcept } from '../../__mocks__/concepts';

const store = createMockStore(Authenticated);
describe('Dashboard SpecificConceptTable Component', () => {
  it('should render without crashing', () => {
    const props = {
      concept: existingConcept,
      addExistingConcept: jest.fn(),
    };
    const wrapper = mount(<MemoryRouter>
      <Provider store={store}>
        <SpecificConceptTable {...props} />
      </Provider>
    </MemoryRouter>);

    expect(wrapper).toMatchSnapshot();
  });
  it('calls the handleAdd function when the Add link is clicked', () => {
    const props = {
      concept: existingConcept,
      addExistingConcept: jest.fn(() => {}),
    };
    const wrapper = mount(<MemoryRouter>
      <Provider store={store}>
        <SpecificConceptTable {...props} />
      </Provider>
    </MemoryRouter>);
    wrapper.find('.add-btn').at(0).simulate('click');
  });
});
