import React from 'react';
import { shallow } from 'enzyme';
import ViewConceptMappings from '../../../components/dictionaryConcepts/components/ViewConceptMappings';

let wrapper;
let props;

describe('render ViewConceptMappings', () => {
  beforeEach(() => {
    props = {
      editModalIsOpen: false,
      handleToggle: jest.fn(),
      showDeleteMappingModal: jest.fn(),
      handleDeleteMapping: jest.fn(),
      mappings: [],
      displayName: '',
      mappingLimit: 10,
    };
    wrapper = shallow(<ViewConceptMappings {...props} />);
  });
  it('should render without breaking', () => {
    expect(wrapper.length).toEqual(1);
  });

  it('should set modal to false by default', () => {
    expect(wrapper.state().editModalIsOpen).toBe(false);
  });

  it('should handle modal toggle', () => {
    wrapper.find('.actionButtons').simulate('click');
    expect(wrapper.state().editModalIsOpen).toBe(true);
  });
});
