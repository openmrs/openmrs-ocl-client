import React from 'react';
import { shallow } from 'enzyme';
import DescriptionRow from '../../../components/dictionaryConcepts/components/DescriptionRow';

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
  addDataFromDescription: jest.fn(),
  removeDescription: jest.fn(),
};

describe('Test suite for DescriptionRow ', () => {
  it('should render on change handleNameLocale', () => {
    const wrapper = shallow(<DescriptionRow {...props} />);
    const selectedOptions = {
      value: '',
    };
    wrapper.find('#description-locale').simulate('change', selectedOptions);
  });
});
