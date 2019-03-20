import React from 'react';
import { shallow } from 'enzyme';
import AnswerRow from
  '../../../components/dictionaryConcepts/components/AnswerRow';


describe('Test select input field', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      display_name: 'test display name',
      handleAnswerChange: jest.fn(),
      id: 'testID',
      isEditConcept: false,
      removeAnswerRow: jest.fn(),
      frontEndUniqueKey: 'unique',
      handleAsyncSelectChange: jest.fn(),
      currentDictionaryName: 'test dictionary',
      prePopulated: false,
    };
  });

  it('should find an input instead of select if answer was prepopulated', () => {
    const newProps = {
      ...props,
      isEditConcept: true,
      prePopulated: true,
    };
    wrapper = shallow(<AnswerRow {...newProps} />);
    expect(wrapper.find('input')).toBeTruthy();
  });

  it('should remove row when button is clicked', () => {
    wrapper = shallow(<AnswerRow {...props} />);
    const removeButton = wrapper.find('button');
    removeButton.simulate('click');
    expect(props.removeAnswerRow).toHaveBeenCalled();
  });

  it('should change the source in the state', () => {
    wrapper = shallow(<AnswerRow {...props} />);
    const select = wrapper.find('select');
    const event = {
      target: {
        value: 'value',
      },
    };
    select.simulate('change', event);
    const instance = wrapper.instance();
    expect(instance.state.source).toEqual('value');
  });
});
