import React from 'react';
import { shallow } from 'enzyme';
import ActionButtons from '../../../components/dictionaryConcepts/components/ActionButtons';

const props = {
  actionButtons: true,
  id: '1',
  concept_class: 'drug',
  url: '/url',
};

describe('Test suite for ActionButton', () => {
  it('should render ActionButton Component', () => {
    const wrapper = shallow(<ActionButtons {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
