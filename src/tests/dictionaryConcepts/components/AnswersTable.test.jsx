import React from 'react';
import { shallow } from 'enzyme';
import AnswersTable from
  '../../../components/dictionaryConcepts/components/AnswersTable';
import answers from '../../__mocks__/answers';

const props = {
  answer: answers,
  addDataFromAnswer: jest.fn(),
  removeAnswer: jest.fn(),
  removeDataFromRow: jest.fn(),
  existingConcept: {},
};

describe('Test suite for AnswersTable', () => {
  it('should render DescriptionTable Component', () => {
    const wrapper = shallow(<AnswersTable {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
