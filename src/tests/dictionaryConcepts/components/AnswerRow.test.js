import React from 'react';
import { shallow } from 'enzyme';
import AnswerRow from
  '../../../components/dictionaryConcepts/components/AnswerRow';

const props = {
  display_name: 'test display name',
  handleAnswerChange: jest.fn(),
  id: 'testID',
};

describe('Snapshot test for AnswerRow', () => {
  it('should snapshot AnswerRow component', () => {
    const wrapper = shallow(<AnswerRow {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});

describe('Test select input field', () => {
  it('should change the input value', () => {
    const wrapper = shallow(<AnswerRow {...props} />);
    const mapscopeSelect = wrapper.find('select').at(0);
    const maptypeSelect = wrapper.find('select').at(1);
    mapscopeSelect.simulate('change');
    maptypeSelect.simulate('change');
    expect(props.handleAnswerChange).toHaveBeenCalledTimes(2);
  });
});
