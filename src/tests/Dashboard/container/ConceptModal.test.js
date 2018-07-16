import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { createMockStore } from 'redux-test-utils';
import Authenticated from '../../__mocks__/fakeStore';
import AddConceptModal from '../../../components/dashboard/components/concepts/ConceptModal';
import { existingConcept } from '../../__mocks__/concepts';

const store = createMockStore(Authenticated);
describe('Concept Modal', () => {
  it('should render without crushing', () => {
    const props = {
      props: existingConcept,
      addExistingConcept: jest.fn(() => {}),
    };
    const wrapper = mount(<Provider store={store}>
      <AddConceptModal {...props} />
    </Provider>);
    expect(wrapper).toMatchSnapshot();
  });

  it('calls the handleAdd function when the Add link is clicked', () => {
    const props = {
      props: existingConcept,
      addExistingConcept: jest.fn(() => {}),
    };
    const wrapper = mount(<Provider store={store}>
      <AddConceptModal {...props} />
    </Provider>);
    global.document.getElementById = jest.fn().mockImplementation(() => ({
      click: jest.fn(),
    }));
    wrapper.find('#modal-add-btn').simulate('click');
  });
});
