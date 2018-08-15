import React from 'react';
import { shallow } from 'enzyme';
import DescriptionTable from
  '../../../components/dictionaryConcepts/components/DescriptionTable';

const props = {
  existingConcept: {
    descriptions: [
      {
        uuid: '1234',
      },
    ],
  },
  description: [],
};

describe('Test suite for DescriptionTable', () => {
  it('should render DescriptionTable Component', () => {
    const wrapper = shallow(<DescriptionTable {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
  it('should render CreateConceptTable Component for undefined existingConcepts', () => {
    props.existingConcept = undefined;
    const wrapper = shallow(<DescriptionTable {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
