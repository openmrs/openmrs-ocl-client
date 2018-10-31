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
  pathName: {
    language: 'en',
  },
  addDataFromDescription: jest.fn(),
  removeDescription: jest.fn(),
  removeDataFromRow: jest.fn(),
};

describe('Test suite for DescriptionTable', () => {
  it('should render DescriptionTable Component', () => {
    const wrapper = shallow(<DescriptionTable {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
  it('should render CreateConceptTable Component for undefined existingConcepts', () => {
    props.existingConcept = {};
    const wrapper = shallow(<DescriptionTable {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
