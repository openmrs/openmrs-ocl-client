
import React from 'react';
import { mount } from 'enzyme';
import {
  Button, Modal,
} from 'reactstrap';
import { Provider } from 'react-redux';
import { createMockStore } from 'redux-test-utils';
import ViewMappingsModal from '../../../components/dictionaryConcepts/components/ViewMappingsModal';

let wrapper;
let props;
const store = createMockStore();

describe('render ViewMappingsModal', () => {
  beforeEach(() => {
    props = {
      modal: true,
      concepts: [],
      handleToggle: jest.fn(),
      editMapping: jest.fn(),
      mappings: [{
        to_concept_url: '',
        url: '',
        map_type: '',
        to_concept_name: '',
      }],
      mappingLimit: 10,
      displayName: 'Paracetamol',
      source: '',
    };
    wrapper = mount(
      <Provider store={store}>
        <ViewMappingsModal.WrappedComponent {...props} />
      </Provider>,
    );
  });
  it('should render without breaking', () => {
    expect(wrapper.length).toEqual(1);
  });
  it('should render without breaking', () => {
    props = {
      modal: false,
      handleToggle: jest.fn(),
      mappings: [{
        to_concept_url: '',
        url: '',
        map_type: '',
        to_concept_name: '',
      }],
      displayName: 'Paracetamol',
      source: '',
    };
    wrapper = mount(
      <Provider store={store}>
        <ViewMappingsModal.WrappedComponent {...props} />
      </Provider>,
    );
    expect(wrapper.length).toEqual(1);
  });
  it('should contain a modal.', () => {
    const modalWrapper = wrapper.find(Modal);
    expect(modalWrapper.length).toEqual(2);
  });
  it('should close modal when click cancel', () => {
    wrapper.find(Button).simulate('click');
    expect(props.handleToggle).toBeCalled();
  });
});
