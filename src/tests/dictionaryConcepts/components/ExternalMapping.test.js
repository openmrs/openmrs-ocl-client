import React from 'react';
import { shallow } from 'enzyme';
import ExternalMapping from '../../../components/dictionaryConcepts/components/ExternalMapping';
import concept from '../../__mocks__/concepts';

let wrapper;
let props;

describe('render MappingModal', () => {
  beforeEach(() => {
    props = {
      mapType: '',
      conceptUrl: '',
      concept,
      handleChange: jest.fn(),
      handleAsyncSelect: jest.fn(),
      onChange: jest.fn(),
    };
    wrapper = shallow(<ExternalMapping {...props} />);
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
    wrapper.find('#mapType').simulate('change', event);
    expect(props.handleChange).toHaveBeenCalled();
  });
});
