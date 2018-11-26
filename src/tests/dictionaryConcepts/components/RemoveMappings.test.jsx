import React from 'react';
import { shallow } from 'enzyme';
import RemoveMappings from '../../../components/dictionaryConcepts/components/RemoveMappings';

let wrapper;
let props;

describe('render RemoveMappings', () => {
  beforeEach(() => {
    props = {
      modal: false,
      handleToggle: jest.fn(),
      showDeleteMappingModal: jest.fn(),
      handleDeleteMapping: jest.fn(),
      mappings: [{ url: 'jengkjeng' }],
      mappingLimit: 10,
      url: '',
      retired: false,
    };
    wrapper = shallow(<RemoveMappings {...props} />);
  });
  it('should render without breaking', () => {
    expect(wrapper.length).toEqual(1);
  });

  it('should set modal to false by default', () => {
    expect(wrapper.state().modal).toBe(false);
  });

  it('should handle modal toggle', () => {
    wrapper.find('.actionButtons').simulate('click');
    expect(wrapper.state().modal).toBe(true);
  });
});
