import React from 'react';
import { mount } from 'enzyme';
import SelectAnswers from '../../../components/dictionaryConcepts/containers/SelectAnswers';
import { KEY_CODE_FOR_ESCAPE, KEY_CODE_FOR_ENTER, KEY_CODE_FOR_SPACE } from '../../../components/dictionaryConcepts/components/helperFunction';


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
    };
    wrapper = mount(<SelectAnswers {...props} />);
  });

  it('should handle key down event when a user presses enter button to search for concept', async () => {
    const spy = jest.spyOn(wrapper.instance(), 'handleKeyDown');
    const event = { keyCode: KEY_CODE_FOR_ENTER };
    await wrapper.instance().handleKeyDown(event, 'malaria');
    expect(spy).toHaveBeenCalled();
    expect(wrapper.state().isVisible).toBeTruthy();
  });

  it('should handle key down event when a user presses enter button to search for concept with input less that 3', async () => {
    const event = { keyCode: KEY_CODE_FOR_ENTER };
    await wrapper.instance().handleKeyDown(event, 'ma');
    expect(wrapper.state().isVisible).toBeFalsy();
  });

  it('should handle key down event when a user presses button thats not enter to search for concept', () => {
    const spy = jest.spyOn(wrapper.instance(), 'handleKeyDown');
    const event = { keyCode: KEY_CODE_FOR_SPACE };
    wrapper.find('#searchInputCiel').simulate('keyDown', event);
    expect(spy).toHaveBeenCalled();
  });

  it('should handle key down event when a user presses escape button to remove the dropdown', () => {
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
});
