import React from 'react';
import { shallow } from 'enzyme';
import ConceptNameRows from '../../../components/dictionaryConcepts/components/ConceptNameRows';

const props = {
  pathName: {
    language: 'en',
  },
  addDataFromRow: jest.fn(),
  removeRow: jest.fn(),
  removeDataFromRow: jest.fn(),
  existingConcept: {},
  newRow: {
    uuid: '123',
  },
};

describe('Test suite for ConceptNameRows ', () => {
  it('should render ConceptNameRows  Component', () => {
    const wrapper = shallow(<ConceptNameRows {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render on change handleNameLocale', () => {
    const wrapper = shallow(<ConceptNameRows {...props} />);
    const selectedOptions = {
      value: '',
    };
    wrapper.find('#locale_full').simulate('change', selectedOptions);
  });
});
