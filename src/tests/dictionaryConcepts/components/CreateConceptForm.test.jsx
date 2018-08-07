import React from 'react';
import { shallow } from 'enzyme';
import CreateConceptForm from '../../../components/dictionaryConcepts/components/CreateConceptForm';

const props = {
  state: {
    id: 1,
  },
};

describe('Test suite for CreateConceptForm', () => {
  it('should render CreateConceptForm Component', () => {
    const wrapper = shallow(<CreateConceptForm {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
