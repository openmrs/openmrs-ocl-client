import React from 'react';
import { shallow } from 'enzyme';
import CreateConceptForm from '../../../components/dictionaryConcepts/components/CreateConceptForm';

describe('Test suite for CreateConceptForm', () => {
  it('should render CreateConceptForm Component', () => {
    const props = {
      state: {
        id: 1,
      },
    };
    const wrapper = shallow(<CreateConceptForm {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render form for set concept class', () => {
    const props = {
      state: {
        id: 1,
      },
      concept: 'set',
    };
    const wrapper = shallow(<CreateConceptForm {...props} />);
    expect(wrapper.find('select.set')).toHaveLength(1);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render form for symptom-finding concept class', () => {
    const props = {
      state: {
        id: 1,
      },
      concept: 'symptom-finding',
    };
    const wrapper = shallow(<CreateConceptForm {...props} />);
    expect(wrapper.find('select.symptom-finding')).toHaveLength(1);
    expect(wrapper).toMatchSnapshot();
  });
});
