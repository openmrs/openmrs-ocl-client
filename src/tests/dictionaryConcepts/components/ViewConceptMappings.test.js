import React from 'react';
import { shallow } from 'enzyme';
import ViewConceptMappings from '../../../components/dictionaryConcepts/components/ViewConceptMappings';

let wrapper;
let props;

describe('render ViewConceptMappings', () => {
  beforeEach(() => {
    props = {
      modal: false,
      handleToggle: jest.fn(),
      mappings: [],
      mappingLimit: 10,
    };
    wrapper = shallow(<ViewConceptMappings {...props} />);
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
