import React from 'react';
import { shallow } from 'enzyme';
import AnswersTable from '../../../components/dictionaryConcepts/components/AnswersTable';
import selectedAnswers from '../../__mocks__/answers';

const defaultProps = {
  selectedAnswers,
  addDataFromAnswer: jest.fn(),
  removeAnswerRow: jest.fn(),
  removeDataFromRow: jest.fn(),
  existingConcept: {},
  handleAsyncSelectChange: jest.fn(),
  queryAnswers: jest.fn(),
  currentDictionaryName: 'test dictionary',
  isEditConcept: false,
  removeCurrentAnswer: jest.fn(),
};

describe('Test suite for AnswersTable', () => {
  it('should render DescriptionTable Component', () => {
    const props = {
      ...defaultProps,
      frontEndUniqueKey: 'unique',
    };
    const wrapper = shallow(<AnswersTable {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  // Existing answers returned by the API do not have a frontEndUniqueKey value
  it('should render DescriptionTable Component with existing answers', () => {
    const props = {
      ...defaultProps,
      selectedAnswers: [
        ...selectedAnswers,
        {
          display_name: 'test display name 3',
        },
      ],
    };
    const wrapper = shallow(<AnswersTable {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
