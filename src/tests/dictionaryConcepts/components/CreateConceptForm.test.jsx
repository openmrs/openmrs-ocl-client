import React from 'react';
import { mount, shallow } from 'enzyme';
import CreateConceptForm from '../../../components/dictionaryConcepts/components/CreateConceptForm';
import { mockSource } from '../../__mocks__/concepts';
import { CONCEPT_CLASS } from '../../../components/dictionaryConcepts/components/helperFunction';

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
      numericPrecisionOptions:{
        numericEnabled: false,
      },
      match: {
        params: {
          conceptType: '',
          dictionaryName: '',
        },
      },
      concept: '',
      allSources: [mockSource],
    };
    const wrapper = shallow(<CreateConceptForm {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render form for set concept class', () => {
    const props = {
      state: {
        id: '1',
      },
      concept: 'Set',
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
      allSources: [mockSource],
      numericPrecisionOptions:{
        numericEnabled: false,
      },
    };
    const wrapper = shallow(<CreateConceptForm {...props} />);
    expect(wrapper.find('select.set')).toHaveLength(1);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render form for symptom-finding concept class', () => {
    const props = {
      state: {
        id: '1',
        concept_class: 'Symptom-Finding',
      },
      concept: 'Symptom-Finding',
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
      numericPrecisionOptions:{
        numericEnabled: false,
      },
      allSources: [mockSource],
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
      concept: CONCEPT_CLASS.question,
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
      numericPrecisionOptions:{
        numericEnabled: false,
      },
      allSources: [mockSource],
    };
    const wrapper = shallow(<CreateConceptForm {...props} />);
    expect(wrapper.find('.form-group.answer')).toHaveLength(1);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render all the components to display all the possible options available when creating another kind of concept', () => {
    const props = {
      state: {
        id: '1',
      },
      concept: '',
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
      allSources: [mockSource],
      numericPrecisionOptions:{
        numericEnabled: false,
      },
      mappings: [{
        id: 'uniqueid',
        retired: false,
      }],
    };
    const wrapper = mount(<CreateConceptForm {...props} />);
    expect(wrapper.find('CreateConceptTable').length).toBe(1);
    expect(wrapper.find('DescriptionTable').length).toBe(1);
    expect(wrapper.find('AnswersTable').length).toBe(2);
    expect(wrapper.find('CreateMapping').length).toBe(1);
    wrapper.unmount();
  });

  it('should display all the possible options when editing a concept', () => {
    const props = {
      state: {
        id: '1',
      },
      mappings: [{
        id: 'uniqueid',
        retired: false,
      }],
      addDescription: jest.fn(),
      handleNewName: jest.fn(),
      toggleUUID: jest.fn(),
      handleChange: jest.fn(),
      handleSubmit: jest.fn(),
      addAnswer: jest.fn(),
      concept: CONCEPT_CLASS.diagnosis,
      editable: false,
      nameRows: [],
      disableButton: false,
      allSources: [mockSource],
      numericPrecisionOptions:{
        numericEnabled: false,
      },
      isEditConcept: true,
    };
    const wrapper = shallow(<CreateConceptForm {...props} />);
    expect(wrapper.find('CreateConceptTable').length).toBe(1);
    expect(wrapper.find('DescriptionTable').length).toBe(1);
    expect(wrapper.find('AnswersTable').length).toBe(2);
    expect(wrapper.find('CreateMapping').length).toBe(1);
    wrapper.unmount();
  });

  it('should render form for numericPrecision when dataType is numeric when creating concept', () => {
    const props = {
      state: {
        id: '1',
      },
      concept: 'oldOne',
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
      isEditConcept: false,
      disableButton: false,
      numericPrecisionOptions:{
        numericEnabled: true,
      },
      allSources: [mockSource],
    };
    const wrapper = shallow(<CreateConceptForm {...props} />);
    expect(wrapper.find('NumericPrecision')).toHaveLength(1);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render form for numericPrecision when dataType is numeric', () => {
    const props = {
      state: {
        id: '1',
      },
      concept: '',
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
      numericPrecisionOptions:{
        numericEnabled: true,
      },
      allSources: [mockSource],
    };
    const wrapper = shallow(<CreateConceptForm {...props} />);
    expect(wrapper.find('NumericPrecision')).toHaveLength(1);
    expect(wrapper).toMatchSnapshot();
  });
});
