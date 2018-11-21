
import React from 'react';
import { shallow } from 'enzyme';
import {
  Button, Modal,
} from 'reactstrap';
import ViewMappingsModal from '../../../components/dictionaryConcepts/components/ViewMappingsModal';

let wrapper;
let props;

describe('render ViewMappingsModal', () => {
  beforeEach(() => {
    props = {
      modal: false,
      handleToggle: jest.fn(),
      mappings: [],
      mappingLimit: 10,
      displayName: 'Paracetamol',
    };
    wrapper = shallow(<ViewMappingsModal {...props} />);
  });
  it('should render without breaking', () => {
    expect(wrapper.length).toEqual(1);
  });
  it('should contain a modal.', () => {
    const modalWrapper = wrapper.find(Modal);
    expect(modalWrapper.length).toEqual(1);
  });
  it('should close modal when click cancel', () => {
    wrapper.find(Button).simulate('click');
    expect(props.handleToggle).toBeCalled();
  });
});
