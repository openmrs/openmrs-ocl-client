import React from 'react';
import { shallow } from 'enzyme';
import { Modal } from 'reactstrap';
import RemoveMappingsModal from '../../../components/dictionaryConcepts/components/RemoveMappingsModal';

let wrapper;
let props;

describe('render RemoveMappingsModal', () => {
  beforeEach(() => {
    props = {
      modal: false,
      handleToggle: jest.fn(),
      showDeleteMappingModal: jest.fn(),
      handleDeleteMapping: jest.fn(),
      toggle: jest.fn(),
      mappings: [],
      mappingLimit: 10,
      displayName: 'Paracetamol',
      url: '',
      retired: false,
    };
    wrapper = shallow(<RemoveMappingsModal {...props} />);
  });
  it('should render without breaking', () => {
    expect(wrapper.length).toEqual(1);
  });
  it('should contain a modal.', () => {
    const modalWrapper = wrapper.find(Modal);
    expect(modalWrapper.length).toEqual(1);
  });
  it('should call the showDeleteModal', () => {
    wrapper.find('#retireMapping').simulate('click');
    expect(props.handleDeleteMapping).toBeCalled();
  });
});
