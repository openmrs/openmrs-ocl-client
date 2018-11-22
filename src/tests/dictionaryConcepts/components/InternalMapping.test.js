import React from 'react';
import { shallow } from 'enzyme';
import InternalMapping from '../../../components/dictionaryConcepts/components/InternalMapping';

let wrapper;
let props;

describe('render MappingModal', () => {
  beforeEach(() => {
    props = {
      map_type: '',
      concept_url: '',
      to_concept_url: '',
      to_concept_name: '',
      url: '',
      concepts: [{
        id: 1,
        url: '',
        display_name: '',
      }],
      handleChange: jest.fn(),
    };
    wrapper = shallow(<InternalMapping {...props} />);
  });
  it('should render without breaking', () => {
    expect(wrapper.length).toEqual(1);
  });

  it('should handle input change', () => {
    const event = {
      target: {
        name: 'type',
        value: 'test',
      },
    };
    wrapper.find('#map_type').simulate('change', event);
    expect(props.handleChange).toHaveBeenCalled();
  });
});
