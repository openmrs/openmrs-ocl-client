import React from 'react';
import { shallow, mount } from 'enzyme';
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
  it('should render DescriptionTable Component for new concepts', () => {
    const newProps = {
      ...props,
      existingConcept: {},
      description: [{
        uuid: 'newUUID',
      }, {
        uuid: 'a.n.other',
      }],
    };
    const wrapper = mount(<DescriptionTable {...newProps} />);
    expect(wrapper.find('DescriptionRow').length).toEqual(newProps.description.length);
    expect(wrapper.find('DescriptionRow').at(0).instance().props.newRow)
      .toEqual(newProps.description[0]);
    expect(wrapper).toMatchSnapshot();
  });
});
