import React from 'react';
import { shallow, mount } from 'enzyme';
import AnswerRow from
  '../../../components/dictionaryConcepts/components/AnswerRow';
import { MAP_TYPE } from '../../../components/dictionaryConcepts/components/helperFunction';


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
      removeCurrentAnswer: jest.fn(),
      answer: {},
      isClicked: false,
      answerUrl: '',
      mapType: MAP_TYPE.questionAndAnswer,
    };
  });

  afterEach(() => {
    wrapper.unmount();
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

  it('should change the state to allow the source to be edited when clicked', () => {
    const newProps = {
      ...props,
      isEditConcept: true,
      prePopulated: true,
    };
    wrapper = mount(<table><tbody><AnswerRow {...newProps} /></tbody></table>);
    const instance = wrapper.find('AnswerRow').instance();
    const spy = jest.spyOn(instance, 'handleClick');
    instance.handleClick();
    expect(spy).toHaveBeenCalled();
    expect(instance.state.isClicked).toBe(true);
    expect(instance.state.isEditing).toBe(false);
    expect(instance.state.isPrePopulated).toBe(false);
  });

  it('should not update state on subsequent clicks in the answer input', () => {
    const newProps = {
      ...props,
      isEditConcept: true,
      prePopulated: true,
    };
    wrapper = mount(<table><tbody><AnswerRow {...newProps} /></tbody></table>);
    const instance = wrapper.find('AnswerRow').instance();
    const input = wrapper.find('input').at(0);
    const initialState = instance.state;
    expect(instance.state.isClicked).toBe(false);
    input.simulate('click');
    const newState = instance.state;
    expect(newState).not.toEqual(initialState);
    expect(instance.state.isClicked).toBe(true);
    input.simulate('click');
    expect(instance.state).toEqual(newState);
    expect(instance.state.isClicked).toBe(true);
  });


  it('should call removeCurrentAnswer to remove the existing answer when resetInput is triggered', () => {
    const newProps = {
      ...props,
      isEditConcept: true,
      answer: { prePopulated: true },
    };
    wrapper = mount(<table><tbody><AnswerRow {...newProps} /></tbody></table>);
    const instance = wrapper.find('AnswerRow').instance();
    const e = { key: 'a' };
    instance.resetInput(e);
    const { answerUrl, frontEndUniqueKey, answer } = newProps;
    expect(props.removeCurrentAnswer).toHaveBeenCalledWith({ answerUrl, frontEndUniqueKey, answer });
  });
});
