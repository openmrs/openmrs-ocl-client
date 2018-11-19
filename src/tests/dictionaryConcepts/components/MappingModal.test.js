import React from 'react';
import { shallow } from 'enzyme';
import MappingModal from '../../../components/dictionaryConcepts/components/MappingModal';

let wrapper;
let props;

describe('render MappingModal', () => {
  beforeEach(() => {
    props = {
      modal: false,
      handleToggle: jest.fn(),
    };
    wrapper = shallow(<MappingModal {...props} />);
  });
  it('should render without breaking', () => {
    expect(wrapper.length).toEqual(1);
  });

  it('should handle change of type', () => {
    const event = {
      target: {
        name: 'type',
        value: 'test',
      },
    };
    wrapper.find('#type').simulate('change', event);
    expect(wrapper.state().type).toBe('test');
  });

  it('should handle change', () => {
    const event = {
      target: {
        name: 'map_type',
        value: 'test',
      },
    };
    wrapper.instance().handleChange(event);
    expect(wrapper.state().map_type).toBe('test');
  });
});
