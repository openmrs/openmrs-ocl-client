import React from 'react';
import { shallow } from 'enzyme';
import AnswersTable from
  '../../../components/dictionaryConcepts/components/AnswersTable';
import selectedAnswers from '../../__mocks__/answers';

const props = {
  selectedAnswers,
  addDataFromAnswer: jest.fn(),
  removeAnswerRow: jest.fn(),
  removeDataFromRow: jest.fn(),
  existingConcept: {},
  handleAsyncSelectChange: jest.fn(),
  queryAnswers: jest.fn(),
  currentDictionaryName: 'test dictionary',
  isEditConcept: false,
  frontEndUniqueKey: 'unique',
};

describe('Test suite for AnswersTable', () => {
  it('should render DescriptionTable Component', () => {
    const wrapper = shallow(<AnswersTable {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
