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
import {
  INTERNAL_MAPPING_DEFAULT_SOURCE,
  CONCEPT_CLASS,
  CONCEPT_TYPE,
  MAP_TYPE,
} from '../../../components/dictionaryConcepts/components/helperFunction';


jest.mock('uuid/v4', () => jest.fn(() => '1234'));
jest.mock('react-notify-toast');

describe('Test suite for dictionary concepts components', () => {
  const removeSetMock = jest.fn();
  const createNewSetRowMock = jest.fn();

  const props = {
    match: {
      params: {
        conceptType: CONCEPT_TYPE.question,
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
    description: [{ uuid: '1' }],
    loading: false,
    newConcept: {
      id: '1',
      concept_class: CONCEPT_CLASS.question,
      datatype: 'Text',
      names: [],
      descriptions: [],
    },
    addedConcept: [{ added: true }],
    state: {
      id: '1',
    },
    selectedAnswers: [{ frontEndUniqueKey: 'unique', id: 'test ID', map_type: 'Q-AND-A' }],
    selectedSets: [{
      frontEndUniqueKey: 'unique', id: 'test ID', map_type: MAP_TYPE.conceptSet, prePopulated: false,
    }],
    addSelectedAnswers: jest.fn(),
    addSelectedSets: jest.fn(),
    fetchAllConceptSources: jest.fn(),
    allSources: [mockSource, mockCielSource],
    unpopulateSelectedAnswers: jest.fn(),
    unpopulateSelectedSets: jest.fn(),
    removeAnswer: jest.fn(),
    removeSet: removeSetMock,
    createNewAnswerRow: jest.fn(),
    createNewSetRow: createNewSetRowMock,
  };

  let wrapper;
  let createConceptComponent;

  beforeEach(() => {
    localStorage.setItem('dictionaryPathName', '/dictionary/url');
    wrapper = mount(<Router>
      <CreateConcept {...props} />
    </Router>);
    createConceptComponent = wrapper.find('CreateConcept');
  });

  afterEach(() => {
    wrapper.unmount();
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
    expect(wrapper.find('h3').text()).toEqual(': Create a Question concept');
    expect(wrapper).toMatchSnapshot();
  });

  it('should render "create a set of concepts" without breaking', () => {
    const newProps = {
      ...props,
      match: {
        ...props.match,
        params: {
          ...props.match.params,
          conceptType: 'Set',
        },
      },
    };
    wrapper = mount(<Router>
      <CreateConcept {...newProps} />
    </Router>);
    expect(wrapper.find('h3').text()).toEqual(': Create a Set of concepts');
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
    const propsWithDescriptions = {
      ...props,
      description: [{ uuid: 'somethingunique' }],
    };
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
    const event = { target: { name: 'id', value: '12345ft-007#' } };
    wrapper.find('#id').simulate('change', event);
    wrapper.find('#toggleUUID').simulate('click');
    const newEvent = { target: { name: 'external_id', value: '12345ft-007#' } };
    wrapper.find('#uuid').simulate('change', newEvent);
    wrapper.find('#createConceptForm').simulate('submit', {
      preventDefault: () => {},
    });
    const conceptName = { target: { name: 'name', value: 'test concept' } };
    wrapper.find('#concept-name').simulate('change', conceptName);
    const conceptDatatype = { target: { name: 'datatype', value: '' } };
    wrapper.find('#datatype').simulate('change', conceptDatatype);
    wrapper.find('#toggleUUID').simulate('click');
    const uuid = { target: { name: 'external_id', value: '12345ft-007' } };
    wrapper.find('#uuid').simulate('change', uuid);
    const newUuid = { target: { name: 'id', value: '12345ft-007' } };
    wrapper.find('#id').simulate('change', newUuid);
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
    wrapper.find('#toggleUUID').simulate('click');
    const uuid = { target: { name: 'external_id', value: '12345ft-007' } };
    wrapper.find('#uuid').simulate('change', uuid);
    const newUuid = { target: { name: 'id', value: '12345ft-006' } };
    wrapper.find('#id').simulate('change', newUuid);
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

  describe('handleSetAsyncSelectChange', () => {
    it('should update the state with sets', () => {
      const instance = wrapper.find('CreateConcept').instance();
      instance.handleSetAsyncSelectChange([{
        frontEndUniqueKey: 'unique', id: 'test ID', map_type: MAP_TYPE.conceptSet, prePopulated: false,
      }], 'abc');
      expect(instance.state.sets).toEqual([{
        frontEndUniqueKey: 'unique', id: 'test ID', map_type: MAP_TYPE.conceptSet, prePopulated: false,
      }]);
    });
  });

  it('should add new answer row', () => {
    const instance = wrapper.find('CreateConcept').instance();
    const spy = jest.spyOn(instance, 'addAnswerRow');
    instance.addAnswerRow();
    expect(spy).toHaveBeenCalled();
  });

  describe('addSetRow', () => {
    it('should correctly call createNewSetRow', () => {
      const instance = wrapper.find('CreateConcept').instance();
      createNewSetRowMock.mockClear();
      instance.addSetRow();
      expect(createNewSetRowMock).toHaveBeenCalledTimes(1);
    });
  });

  it('should remove answer row', () => {
    const instance = wrapper.find('CreateConcept').instance();
    const spy = jest.spyOn(instance, 'removeAnswerRow');
    instance.removeAnswerRow('uniqueKey');
    expect(spy).toHaveBeenCalled();
  });

  describe('remove set', () => {
    it('should remove set row', () => {
      const instance = wrapper.find('CreateConcept').instance();
      removeSetMock.mockClear();
      instance.removeSetRow('uniqueKey');
      expect(removeSetMock).toHaveBeenCalledWith('uniqueKey');
    });
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

  it('should follow the provided path when the Leave button is clicked', () => {
    const mockPath = localStorage.getItem('dictionaryPathName');
    const spy = jest.spyOn(createConceptComponent.instance(), 'selectConfirm');
    createConceptComponent.setState({ show: true }, () => {
      wrapper.find('.leaveButton').at(1).simulate('click');
      expect(spy).toHaveBeenCalled();
      expect(props.history.push).toHaveBeenCalledWith(mockPath);
    });
  });

  it('should hide the modal when the Stay button is clicked', () => {
    const spy = jest.spyOn(createConceptComponent.instance(), 'hideModal');
    createConceptComponent.setState({ show: true });
    wrapper.find('.stayButton').at(1).simulate('click');
    expect(spy).toHaveBeenCalled();
    expect(createConceptComponent.instance().state.show).toEqual(false);
  });

  it('should show the modal when Cancel is clicked with unsaved changes', () => {
    const event = {
      target: {
        name: 'datatype',
        value: 'Complex',
      },
    };
    wrapper.find('select#datatype').simulate('change', event);
    wrapper.find('.cancelButton').simulate('click');
    expect(createConceptComponent.instance().state.show).toEqual(true);
  });

  it('should not show the modal when cancel is clicked without unsaved changes', () => {
    const createConceptInstance = createConceptComponent.instance();
    createConceptInstance.oldState = createConceptInstance.state;
    wrapper.find('.cancelButton').simulate('click');
    expect(createConceptInstance.state.show).toEqual(false);
  });
  it('should set `NARROWER-THAN` as the default relationship when the source is changed to `MapTypes`'
  + 'while creating a new concept', () => {
    const event = {
      target: {
        tabIndex: 0,
        name: 'source',
        value: '',
      },
    };
    const url = '1234';
    const instance = wrapper.find('CreateConcept').instance();
    instance.state.mappings[1] = {
      source: 'MapTypes',
      url,
    };
    instance.updateSourceEventListener(event, url, { url: '/not/ciel/' });
    setImmediate(() => {
      expect(instance.state.mappings[1].map_type).toEqual('NARROWER-THAN');
    });
  });
  it('should set `SAME-AS` as the default relationship when the source is changed to `CIEL`'
  + 'while creating a new concept', () => {
    const event = {
      target: {
        tabIndex: 0,
        name: 'source',
        value: INTERNAL_MAPPING_DEFAULT_SOURCE,
      },
    };
    const url = '1234';
    const instance = wrapper.find('CreateConcept').instance();

    instance.updateSourceEventListener(event, url);
    setImmediate(() => {
      expect(instance.state.mappings[0].map_type).toEqual('SAME-AS');
    });
  });
});
