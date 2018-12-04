import React from 'react';
import { shallow } from 'enzyme';
import AddMapping from '../../../components/dictionaryConcepts/components/AddMapping';

let wrapper;

describe('render MappingModal', () => {
  const props = {
    to_concept_name: '',
    to_concept_url: '',
    source: '',
    url: '',
    map_type: '',
    concepts: [],
    editMapping: jest.fn(),
  };
  beforeEach(() => { wrapper = shallow(<AddMapping {...props} />); });
  it('should render without breaking', () => {
    expect(wrapper.length).toEqual(1);
  });

  it('should handle type change', () => {
    wrapper.find('.actionButtons').simulate('click');
    expect(wrapper.state().modal).toBe(true);
  });
});
