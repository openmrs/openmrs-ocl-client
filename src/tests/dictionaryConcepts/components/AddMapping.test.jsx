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
    buttonName: '',
  };
  beforeEach(() => { wrapper = shallow(<AddMapping {...props} />); });
  it('should render without breaking', () => {
    expect(wrapper.length).toEqual(1);
  });

  it('should handle type change', () => {
    wrapper.find('.actionButtons').simulate('click');
    expect(wrapper.state().modal).toBe(true);
  });

  it('should test componentWillReceiveProps', () => {
    const newProps = {
      ...props,
      to_concept_name: 'newone',
    };
    wrapper.setProps(newProps);
  });

  it('should test componentWillReceiveProps with same prop values', () => {
    const newProps = {
      ...props,
    };
    wrapper.setProps(newProps);
  });
});
