import React from 'react';
import { shallow } from 'enzyme';
import CreateConceptTable from '../../../components/dictionaryConcepts/components/CreateConceptTable';

const props = {
  existingConcept: {
    names: [
      {
        uuid: '1234',
      },
    ],
  },
  nameRows: [],
};

describe('Test suite for CreateConceptTable', () => {
  it('should render CreateConceptTable Component', () => {
    const wrapper = shallow(<CreateConceptTable {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
  it('should render CreateConceptTable Component for undefined existingConcepts', () => {
    props.existingConcept = undefined;
    const wrapper = shallow(<CreateConceptTable {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
