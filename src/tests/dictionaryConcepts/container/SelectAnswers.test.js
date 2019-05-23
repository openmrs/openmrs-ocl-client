import React from 'react';
import { mount } from 'enzyme';
import SelectAnswers from '../../../components/dictionaryConcepts/containers/SelectAnswers';
import { KEY_CODE_FOR_ESCAPE, KEY_CODE_FOR_ENTER, KEY_CODE_FOR_SPACE, MAP_TYPE } from '../../../components/dictionaryConcepts/components/helperFunction';


jest.mock('react-notify-toast');

describe('<SelectAnswers />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      handleAsyncSelectChange: jest.fn(),
      queryAnswers: jest.fn(),
      source: 'test source',
      frontEndUniqueKey: 'unique',
      defaultValue: '',
      index: 0,
      isShown: false,
      answer: {},
      answerUrl: '',
      removeCurrentAnswer: jest.fn(),
      mapType: MAP_TYPE.questionAndAnswer,
      handleClick: jest.fn(),
    };
    wrapper = mount(<SelectAnswers {...props} />);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('should handle key down event when a user presses enter button to search for concept', async () => {
    const spy = jest.spyOn(wrapper.instance(), 'handleKeyDown');
    wrapper.find('#searchInputCiel').simulate('keyDown');
    expect(spy).toHaveBeenCalled();
    expect(wrapper.state().isClicked).toBeTruthy();
    const event = { keyCode: KEY_CODE_FOR_ENTER };
    await wrapper.instance().handleKeyDown(event, 'malaria');
    expect(wrapper.state().isVisible).toBeTruthy();
  });

  it('should handle key down event when a user presses enter button to search for concept with input less that 3', async () => {
    wrapper.find('#searchInputCiel').simulate('keyDown');
    const event = { keyCode: KEY_CODE_FOR_ENTER };
    await wrapper.instance().handleKeyDown(event, 'ma');
    expect(wrapper.state().isVisible).toBeFalsy();
  });

  it('should handle key down event when a user presses button thats not enter to search for concept', () => {
    wrapper.find('#searchInputCiel').simulate('keyDown');
    const spy = jest.spyOn(wrapper.instance(), 'handleKeyDown');
    const event = { keyCode: KEY_CODE_FOR_SPACE };
    wrapper.find('#searchInputCiel').simulate('keyDown', event);
    expect(spy).toHaveBeenCalled();
  });

  it('should handle key down event when a user presses escape button to remove the dropdown', () => {
    wrapper.find('#searchInputCiel').simulate('keyDown');
    const spy = jest.spyOn(wrapper.instance(), 'handleKeyDown');
    const event = { keyCode: KEY_CODE_FOR_ESCAPE };
    wrapper.find('#searchInputCiel').simulate('keyDown', event);
    expect(spy).toHaveBeenCalled();
  });

  it('should handle select when a user clicks to select a prefered concept', () => {
    const newProps = {
      ...props,
      isShown: true,
    };
    wrapper = mount(<SelectAnswers {...newProps} />);
    wrapper.setState({
      options: [{
        display_name: 'MALARIAL SMEAR',
        label: 'CIEL: MALARIAL SMEAR',
        value: '/orgs/CIEL/sources/CIEL/concepts/32/',
        uuid: 'somethingunique',
      }],
    }, () => {
      const spy = jest.spyOn(wrapper.instance(), 'handleSelect');
      wrapper.find('#selectConcept').simulate('click');
      expect(spy).toHaveBeenCalled();
    });
  });

  it('should handle change when a user inputs concept name data', () => {
    const spy = jest.spyOn(wrapper.instance(), 'handleInputChange');
    wrapper.find('#searchInputCiel').simulate('change');
    expect(spy).toHaveBeenCalled();
  });

  it('should call resetInput  when a user types in a prepopulated answer to edit it', () => {
    const newProps = {
      ...props,
      isShown: true,
      isClicked: false,
      answer: {
        prePopulated: true,
      },
    };
    wrapper = mount(<SelectAnswers {...newProps} />);
    const spy = jest.spyOn(wrapper.instance(), 'resetInput');
    wrapper.find('#searchInputCiel').simulate('keyDown');
    expect(spy).toHaveBeenCalled();
    expect(wrapper.state().isClicked).toBeTruthy();
  });

  it('should clear input and update with current value when a user presses any key', () => {
    const newProps = {
      ...props,
      isShown: true,
      isClicked: false,
      answer: {
        prePopulated: true,
      },
    };
    wrapper = mount(<SelectAnswers {...newProps} />);
    const event = { key: 'a' };
    wrapper.find('#searchInputCiel').simulate('keyDown', event);
    expect(wrapper.state().inputValue).toEqual('a');
    expect(props.removeCurrentAnswer).toHaveBeenCalled();
  });

  it('should clear input when a user presses any non-character key', () => {
    const newProps = {
      ...props,
      isShown: true,
      isClicked: false,
      answer: {
        prePopulated: true,
      },
    };
    wrapper = mount(<SelectAnswers {...newProps} />);
    const e = { key: 'backspace' };
    wrapper.find('#searchInputCiel').simulate('keyDown', e);
    expect(wrapper.state().inputValue).toEqual('');
    expect(props.removeCurrentAnswer).toHaveBeenCalled();
  });
});
