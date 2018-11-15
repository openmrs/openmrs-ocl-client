import React from 'react';
import { shallow } from 'enzyme';
import AddMapping from '../../../components/dictionaryConcepts/components/AddMapping';

let wrapper;

describe('render MappingModal', () => {
  beforeEach(() => {
    wrapper = shallow(<AddMapping />);
  });
  it('should render without breaking', () => {
    expect(wrapper.length).toEqual(1);
  });

  it('should handle type change', () => {
    wrapper.find('.actionButtons').simulate('click');
    expect(wrapper.state().modal).toBe(true);
  });
});
