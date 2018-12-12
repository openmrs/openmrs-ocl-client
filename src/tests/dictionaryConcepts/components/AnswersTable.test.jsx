import React from 'react';
import { shallow } from 'enzyme';
import AnswersTable from
  '../../../components/dictionaryConcepts/components/AnswersTable';
import selectedAnswers from '../../__mocks__/answers';

const props = {
  selectedAnswers,
  addDataFromAnswer: jest.fn(),
  removeAnswer: jest.fn(),
  removeDataFromRow: jest.fn(),
  existingConcept: {},
  handleAsyncSelectChange: jest.fn(),
  queryAnswers: jest.fn(),
};

describe('Test suite for AnswersTable', () => {
  it('should render DescriptionTable Component', () => {
    const wrapper = shallow(<AnswersTable {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
