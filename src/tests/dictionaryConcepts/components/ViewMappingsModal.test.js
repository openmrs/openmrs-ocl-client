
import React from 'react';
import { mount } from 'enzyme';
import {
  Button, Modal,
} from 'reactstrap';
import { Provider } from 'react-redux';
import { createMockStore } from 'redux-test-utils';
import ViewMappingsModal from '../../../components/dictionaryConcepts/components/ViewMappingsModal';
import RemoveMappings from '../../../components/dictionaryConcepts/components/RemoveMappings';

let wrapper;
let props;
const store = createMockStore();

describe('render ViewMappingsModal', () => {
  beforeEach(() => {
    props = {
      modal: true,
      concepts: [{
        id: '2b14dedd-662b-44f7-9fce-05d78de96fc5',
        external_id: null,
        concept_class: 'drug',
        datatype: 'None',
        retired: false,
        source: '858738987555379984',
        owner: 'admin',
        owner_type: 'User',
        owner_url: '/users/admin/',
        display_name: 'Malaria',
        display_locale: 'en',
        version: '5bfea942bdfb8801a1702943',
        mappings: null,
        is_latest_version: true,
        locale: null,
        version_url: '/users/admin/sources/858738987555379984/concepts/2b14dedd-662b-44f7-9fce-05d78de96fc5/5bfea942bdfb8801a1702943/',
        url: '/users/admin/sources/858738987555379984/concepts/2b14dedd-662b-44f7-9fce-05d78de96fc5/',
      }],
      handleToggle: jest.fn(),
      editMapping: jest.fn(),
      showDeleteMappingModal: jest.fn(),
      handleDeleteMapping: jest.fn(),
      mappings: [{
        to_concept_url: '',
        url: '',
        map_type: '',
        to_concept_name: '',
        retired: false,
      }],
      mappingLimit: 10,
      displayName: 'Paracetamol',
      source: '',
      retired: false,
    };
    wrapper = mount(
      <Provider store={store}>
        <ViewMappingsModal.WrappedComponent store={store} {...props} />
      </Provider>,
    );
  });
  it('should render without breaking', () => {
    expect(wrapper.length).toEqual(1);
  });
  it('should render without breaking', () => {
    expect(wrapper.length).toEqual(1);
  });
  it('should contain a modal.', () => {
    const modalWrapper = wrapper.find(Modal);
    expect(modalWrapper.length).toEqual(3);
  });
  it('should close modal when click cancel', () => {
    wrapper.find(Button).simulate('click');
    expect(props.handleToggle).toBeCalled();
  });
  it('render remove mappings if mappings', () => {
    const removeWrapper = wrapper.find(RemoveMappings);
    expect(removeWrapper.length).toEqual(1);
  });
});
