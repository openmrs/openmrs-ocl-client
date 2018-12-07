import React from 'react';
import { shallow } from 'enzyme';
import CreateConceptForm from '../../../components/dictionaryConcepts/components/CreateConceptForm';

describe('Test suite for CreateConceptForm', () => {
  it('should render CreateConceptForm Component', () => {
    const props = {
      state: {
        id: '1',
      },
      addDescription: jest.fn(),
      handleNewName: jest.fn(),
      path: '',
      toggleUUID: jest.fn(),
      handleChange: jest.fn(),
      handleSubmit: jest.fn(),
      editable: false,
      nameRows: [],
      description: [],
      addAnswer: jest.fn(),
      answer: [],
      disableButton: false,
      match: {
        params: {
          conceptType: '',
          dictionaryName: '',
        },
      },
      concept: '',
    };
    const wrapper = shallow(<CreateConceptForm {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render form for set concept class', () => {
    const props = {
      state: {
        id: '1',
      },
      concept: 'set',
      addDescription: jest.fn(),
      handleNewName: jest.fn(),
      path: '',
      toggleUUID: jest.fn(),
      handleChange: jest.fn(),
      handleSubmit: jest.fn(),
      editable: false,
      nameRows: [],
      description: [],
      addAnswer: jest.fn(),
      answer: [],
      disableButton: false,
    };
    const wrapper = shallow(<CreateConceptForm {...props} />);
    expect(wrapper.find('select.set')).toHaveLength(1);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render form for symptom-finding concept class', () => {
    const props = {
      state: {
        id: '1',
      },
      concept: 'symptom-finding',
      addDescription: jest.fn(),
      handleNewName: jest.fn(),
      path: '',
      toggleUUID: jest.fn(),
      handleChange: jest.fn(),
      handleSubmit: jest.fn(),
      editable: false,
      nameRows: [],
      description: [],
      addAnswer: jest.fn(),
      answer: [],
      disableButton: false,
    };
    const wrapper = shallow(<CreateConceptForm {...props} />);
    expect(wrapper.find('select.symptom-finding')).toHaveLength(1);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render form for question concept class', () => {
    const props = {
      state: {
        id: '1',
      },
      concept: 'question',
      addDescription: jest.fn(),
      handleNewName: jest.fn(),
      path: '',
      toggleUUID: jest.fn(),
      handleChange: jest.fn(),
      handleSubmit: jest.fn(),
      editable: false,
      addAnswer: jest.fn(),
      answer: [],
      nameRows: [],
      description: [],
      isEditConcept: true,
      disableButton: false,
    };
    const wrapper = shallow(<CreateConceptForm {...props} />);
    expect(wrapper.find('.form-group.answer')).toHaveLength(1);
    expect(wrapper).toMatchSnapshot();
  });
});
