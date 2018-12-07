import React from 'react';
import { mount, shallow } from 'enzyme';
import Router from 'react-mock-router';
import {
  CreateConcept,
  mapStateToProps,
} from '../../../components/dictionaryConcepts/containers/CreateConcept';
import { newConcept } from '../../__mocks__/concepts';

jest.mock('uuid/v4', () => jest.fn(() => 1234));
jest.mock('react-notify-toast');

describe('Test suite for dictionary concepts components', () => {
  const props = {
    match: {
      params: {
        conceptType: 'question',
        collectionName: 'dev-col',
        type: 'users',
        typeName: 'emasys',
        language: 'en',
      },
    },
    history: {
      push: jest.fn(),
    },
    existingConcept: [],
    createNewName: jest.fn(),
    answer: [12343],
    addNewDescription: jest.fn(),
    clearSelections: jest.fn(),
    removeNewName: jest.fn(),
    removeDescription: jest.fn(),
    createNewConcept: jest.fn(),
    addNewAnswer: jest.fn(),
    removeAnswer: jest.fn(),
    addDataFromAnswer: jest.fn(),
    newName: ['1'],
    description: ['1'],
    loading: false,
    newConcept: {
      id: '1',
      concept_class: 'question',
      datatype: 'Text',
      names: [],
      descriptions: [],
    },
    addedConcept: [{ added: true }],
    state: {
      id: '1',
    },
  };
  it('should render without breaking', () => {
    localStorage.setItem('dictionaryPathName', '/dictionary/url');
    const wrapper = mount(<Router>
      <CreateConcept {...props} />
    </Router>);
    expect(wrapper.find('h3').text()).toEqual(': Create a question Concept ');
    expect(wrapper).toMatchSnapshot();
  });

  it('should handle form completion and submission with invalid/incomplete data', () => {
    const wrapper = mount(<Router>
      <CreateConcept {...props} />
    </Router>);
    wrapper.find('#toggleUUID').simulate('click');
    const event = { target: { name: 'id', value: '12345ft-007' } };
    wrapper.find('#uuid').simulate('change', event);
    wrapper.find('#createConceptForm').simulate('submit', {
      preventDefault: () => {},
    });
    const conceptName = { target: { name: 'name', value: 'test concept' } };
    wrapper.find('#concept-name').simulate('change', conceptName);
    const conceptDatatype = { target: { name: 'datatype', value: '' } };
    wrapper.find('#datatype').simulate('change', conceptDatatype);
    wrapper.find('#toggleUUID').simulate('click');
    const uuid = { target: { name: 'id', value: '12345ft-007#' } };
    wrapper.find('#uuid').simulate('change', uuid);
    const conceptDescription = {
      target: { name: 'description', value: 'test concept description' },
    };
    wrapper.find('#concept-description').simulate('change', conceptDescription);
    wrapper.find('#remove-description').simulate('click');
    wrapper.find('#createConceptForm').simulate('submit', {
      preventDefault: () => {},
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('should handle form completion and submission with correct data', () => {
    const wrapper = mount(<Router>
      <CreateConcept {...props} />
    </Router>);
    const conceptName = { target: { name: 'name', value: 'test concept' } };
    wrapper.find('#concept-name').simulate('change', conceptName);
    const conceptDatatype = { target: { name: 'datatype', value: 'Text' } };
    wrapper.find('#datatype').simulate('change', conceptDatatype);
    const conceptDescription = {
      target: { name: 'description', value: 'test concept description' },
    };
    wrapper.find('#add-more-name').simulate('click');
    wrapper.find('#add-more-description').simulate('click');
    wrapper.find('#remove-description').simulate('click');
    wrapper.find('#remove-name').simulate('click');
    wrapper.find('#concept-description').simulate('change', conceptDescription);
    wrapper.find('.text-left.add-more-answers').simulate('click');
    wrapper.find('#createConceptForm').simulate('submit', {
      preventDefault: () => {},
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('should test componentWillReceiveProps and unmount', () => {
    const newProps = {
      newConcept,
      addedConcept: [{ added: true }],
    };
    jest.useFakeTimers();
    const wrapper = shallow(<CreateConcept {...props} />);
    wrapper.setState({ searchInput: 'ciel' });
    wrapper.setProps(newProps);
    wrapper.unmount();
    jest.runAllTimers();
  });


  it('should handle add-more-answers', () => {
    const wrapper = mount(<Router>
      <CreateConcept {...props} />
    </Router>);
    wrapper.find('.add-more-answers').simulate('click');
    expect(props.addNewAnswer).toHaveBeenCalled();
  });

  it('should handle remove-answers', () => {
    const wrapper = mount(<Router>
      <CreateConcept {...props} />
    </Router>);
    wrapper.find('.concept-form-table-link.answer').simulate('click');
    expect(props.removeAnswer).toHaveBeenCalled();
  });

  it('should handle add data from answer', () => {
    const wrapper = mount(<Router>
      <CreateConcept {...props} />
    </Router>);

    const spy = jest.spyOn(wrapper.find('CreateConcept').instance(), 'addDataFromAnswer');
    const conceptAnswer = { target: { name: 'answer', value: 'test concept' } };
    wrapper.find('#concept-answer').simulate('change', conceptAnswer);
    expect(spy).toHaveBeenCalled();
  });

  it('should test mapStateToProps', () => {
    const initialState = {
      concepts: {
        newName: ['1'],
        description: ['1'],
        newConcept,
      },
    };
    expect(mapStateToProps(initialState).description).toEqual(['1']);
    expect(mapStateToProps(initialState).newConcept).toEqual(newConcept);
    expect(mapStateToProps(initialState).newName).toEqual(['1']);
  });
});
