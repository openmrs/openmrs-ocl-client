import React from 'react';
import { shallow, mount } from 'enzyme';
import SelectAnswers from '../../../components/dictionaryConcepts/containers/SelectAnswers';

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
    wrapper = shallow(<SelectAnswers {...props} />);
  });

  it('should handle change in AsncSelect', () => {
    const instance = wrapper.instance();
    const spy = jest.spyOn(instance, 'handleChange');
    instance.handleChange(['value']);
    expect(spy).toHaveBeenCalled();
    instance.handleChange(null);
    expect(spy).toHaveBeenCalled();
  });

  it('should update the state with current input value', () => {
    wrapper = mount(<SelectAnswers {...props} />);
    const instance = wrapper.instance();
    instance.handleInputChange('searchTerm');
    expect(wrapper.state().inputValue).toEqual('searchTerm');
  });
});
