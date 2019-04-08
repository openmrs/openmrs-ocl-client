import React from 'react';
import { mount, shallow } from 'enzyme';
import { MemoryRouter as Router } from 'react-router';
import {
  CreateConcept,
  mapStateToProps,
} from '../../../components/dictionaryConcepts/containers/CreateConcept';
import {
  newConcept, mockSource, mockCielSource, mockMapping,
} from '../../__mocks__/concepts';
import { INTERNAL_MAPPING_DEFAULT_SOURCE } from '../../../components/dictionaryConcepts/components/helperFunction';

jest.mock('uuid/v4', () => jest.fn(() => '1234'));
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
    addNewDescription: jest.fn(),
    clearSelections: jest.fn(),
    removeNewName: jest.fn(),
    removeDescription: jest.fn(),
    createNewConcept: jest.fn(),
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
    selectedAnswers: [{ frontEndUniqueKey: 'unique', id: 'test ID', map_type: 'Q-AND-A' }],
    addSelectedAnswers: jest.fn(),
    fetchAllConceptSources: jest.fn(),
    allSources: [mockSource, mockCielSource],
    unpopulateSelectedAnswers: jest.fn(),
    removeAnswer: jest.fn(),
    createNewAnswerRow: jest.fn(),
  };

  let wrapper;

  beforeEach(() => {
    localStorage.setItem('dictionaryPathName', '/dictionary/url');
    wrapper = mount(<Router>
      <CreateConcept {...props} />
    </Router>);
  });

  it('should call addMappingRow function', () => {
    const instance = wrapper.find('CreateConcept').instance();
    instance.addMappingRow();
  });

  it('should call removeMappingRow function', () => {
    const url = '9999';
    const instance = wrapper.find('CreateConcept').instance();
    instance.addMappingRow();
    instance.state.mappings[1] = {
      map_type: 'Same as',
      source: INTERNAL_MAPPING_DEFAULT_SOURCE,
      to_concept_code: null,
      to_concept_name: null,
      id: 3,
      to_source_url: null,
      isNew: true,
      retired: false,
      url: '9999',
    };
    expect(instance.state.mappings.filter(_ => _ != null).length).toEqual(2);
    instance.removeMappingRow(url);
    expect(instance.state.mappings[1].retired).toEqual(true);
  });

  it('should call updateAsyncSelectValue function', () => {
    const value = { index: '1234', value: 'malaria 1', label: 'malaria 1' };
    const instance = wrapper.find('CreateConcept').instance();
    instance.updateAsyncSelectValue(null);
    expect(instance.state.mappings[0].to_concept_name).toEqual(null);
    instance.updateAsyncSelectValue(value);
    expect(instance.state.mappings[0].to_concept_name).toEqual('malaria 1');
  });

  it('should call updateEventListener function', () => {
    const event = {
      target: {
        tabIndex: 0,
        name: 'to_concept_code',
        value: 'a234',
      },
    };
    const url = '1234';
    const instance = wrapper.find('CreateConcept').instance();
    instance.updateEventListener({ target: { tabIndex: 0, name: INTERNAL_MAPPING_DEFAULT_SOURCE, value: '' } });
    instance.updateEventListener(event, url);
    expect(instance.state.mappings[0].to_concept_code).not.toEqual(null);
  });

  it('should call updateEventListener function with internal mapping', () => {
    const event = {
      target: {
        tabIndex: 0,
        name: 'to_concept_name',
        value: INTERNAL_MAPPING_DEFAULT_SOURCE,
      },
    };
    const instance = wrapper.find('CreateConcept').instance();
    const spy = jest.spyOn(instance, 'updateEventListener');
    instance.updateEventListener(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should render without breaking', () => {
    expect(wrapper.find('h3').text()).toEqual(': Create a question Concept ');
    expect(wrapper).toMatchSnapshot();
  });

  it('should not call the createNewName function if new names are already available', () => {
    const propsWithNames = { ...props, newName: ['a'] };
    wrapper = mount(<Router><CreateConcept {...propsWithNames} /></Router>);
    expect(propsWithNames.createNewName).not.toHaveBeenCalled();
  });
  it('should call the createNewName function if there are no new names', () => {
    const propsWithoutNames = { ...props, newName: [] };
    wrapper = mount(<Router><CreateConcept {...propsWithoutNames} /></Router>);
    expect(propsWithoutNames.createNewName).toHaveBeenCalled();
  });

  it('should not call the addNewDescription function if new descriptions are already available', () => {
    const propsWithDescriptions = { ...props, description: ['b'] };
    wrapper = mount(<Router><CreateConcept {...propsWithDescriptions} /></Router>);
    expect(propsWithDescriptions.addNewDescription).not.toHaveBeenCalled();
  });
  it('should call the addNewDescription function if there are no new descriptions', () => {
    const propsWithoutDescriptions = { ...props, description: [] };
    wrapper = mount(<Router><CreateConcept {...propsWithoutDescriptions} /></Router>);
    expect(propsWithoutDescriptions.addNewDescription).toHaveBeenCalled();
  });

  it('it should render with a null conceptType', () => {
    const newProps = {
      ...props,
    };

    newProps.match.params.conceptType = null;

    const NewWrapper = mount(<Router>
      <CreateConcept {...newProps} />
    </Router>);
    const instance = NewWrapper.find('CreateConcept').instance();
    instance.addMappingRow();
  });

  it('should handle form completion and submission with invalid/incomplete data', () => {
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
    const conceptName = { target: { name: 'name', value: 'test concept' } };
    wrapper.find('#concept-name').simulate('change', conceptName);
    const conceptClass = { target: { name: 'concept_class', value: 'Procedure' } };
    wrapper.find('#class').simulate('change', conceptClass);
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
    wrapper = shallow(<CreateConcept {...props} />);
    wrapper.setState({ searchInput: 'ciel' });
    wrapper.setProps(newProps);
    wrapper.unmount();
    jest.runAllTimers();
  });

  it('should test mapStateToProps', () => {
    const initialState = {
      concepts: {
        newName: ['1'],
        description: ['1'],
        newConcept,
      },
      sourceConcepts: {
        conceptSources: [],
      },
    };
    expect(mapStateToProps(initialState).description).toEqual(['1']);
    expect(mapStateToProps(initialState).newConcept).toEqual(newConcept);
    expect(mapStateToProps(initialState).newName).toEqual(['1']);
  });

  it('should update the state with answers', () => {
    const instance = wrapper.find('CreateConcept').instance();
    expect(instance.state.answers).toEqual([]);
    instance.handleAsyncSelectChange();
    expect(instance.state.answers).toEqual([{ frontEndUniqueKey: 'unique', id: 'test ID', map_type: 'Q-AND-A' }]);
  });

  it('should add new answer row', () => {
    const instance = wrapper.find('CreateConcept').instance();
    const spy = jest.spyOn(instance, 'addAnswerRow');
    instance.addAnswerRow();
    expect(spy).toHaveBeenCalled();
  });

  it('should remove answer row', () => {
    const instance = wrapper.find('CreateConcept').instance();
    const spy = jest.spyOn(instance, 'removeAnswerRow');
    instance.removeAnswerRow('uniqueKey');
    expect(spy).toHaveBeenCalled();
  });

  it('should pass the Relationship provided to CreateConceptForm', () => {
    wrapper.setState({ mappings: [mockMapping] }, () => {
      const inputValue = 'BROADER-THAN';
      const relationshipDropdown = wrapper.find('select#mapping-relationship');
      const event = { target: { name: 'map_type', value: inputValue } };
      relationshipDropdown.simulate('change', event);
      expect(wrapper.find('CreateConceptForm').props().mappings[0].map_type).toEqual(inputValue);
    });
  });
});
