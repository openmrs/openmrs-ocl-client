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
    };
    wrapper = shallow(<SelectAnswers {...props} />);
  });

  it('should handle change', () => {
    wrapper.simulate('change');
    expect(props.handleAsyncSelectChange).toHaveBeenCalledTimes(1);
  });

  it('should update the state with current input value', () => {
    wrapper = mount(<SelectAnswers {...props} />);
    const instance = wrapper.instance();
    instance.handleInputChange('searchTerm');
    expect(wrapper.state().inputValue).toEqual('searchTerm');
  });
});
