import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter as Router } from 'react-router';
import { notify } from 'react-notify-toast';
import {
  EditConcept,
  mapStateToProps,
} from '../../../components/dictionaryConcepts/containers/EditConcept';
import {
  newConcept, existingConcept, mockSource, sampleConcept, newMappings,
} from '../../__mocks__/concepts';
import mockMappings from '../../__mocks__/mappings';
import {
  INTERNAL_MAPPING_DEFAULT_SOURCE,
  CIEL_SOURCE_URL,
  CONCEPT_TYPE,
  MAP_TYPE,
} from '../../../components/dictionaryConcepts/components/helperFunction';
import api from '../../../redux/api';


jest.mock('uuid/v4', () => jest.fn(() => '1234'));
jest.mock('react-notify-toast');

localStorage.setItem('dictionaryPathName', '/');

const editConceptProps = {
  unretireMapping: jest.fn(),
  dictionaryConcepts: [sampleConcept],
  updateConcept: async () => sampleConcept,
  existingConcept: sampleConcept,
  isEditConcept: true,
  deleteReferenceFromCollection: () => true,
  addReferenceToCollection: () => true,
  unpopulateCurrentSet: jest.fn(),
};

describe('Test suite for dictionary concepts components', () => {
  const props = {
    match: {
      params: {
        conceptType: CONCEPT_TYPE.question,
        collectionName: 'dev-col',
        type: 'users',
        typeName: 'emmabaye',
        language: 'en',
        conceptId: '1',
        name: '',
      },
    },
    history: {
      push: jest.fn(),
      goBack: jest.fn(),
    },
    createNewName: jest.fn(),
    addNewDescription: jest.fn(),
    clearSelections: jest.fn(),
    fetchExistingConcept: async () => jest.fn(),
    clearPreviousConcept: jest.fn(),
    createNewNameForEditConcept: jest.fn(),
    removeDescriptionForEditConcept: jest.fn(),
    addDescriptionForEditConcept: jest.fn(),
    removeNameForEditConcept: jest.fn(),
    removeConceptMappingAction: jest.fn(),
    updateConcept: jest.fn(),
    addNewAnswer: jest.fn(),
    removeAnswer: jest.fn(),
    newName: ['1'],
    description: ['1'],
    answers: [],
    loading: false,
    existingConcept: {
      names: [{
        uuid: '1234',
        name: 'dummy',
      }],
      descriptions: [{
        uuid: '1234',
        name: 'dummy',
      }],
    },
    newRow: '1234',
    fetchAllConceptSources: jest.fn(),
    allSources: [mockSource],
    addSelectedAnswers: jest.fn(),
    selectConfirm: jest.fn(),
    selectedAnswers: [],
    createNewAnswerRow: jest.fn(),
    removeEditedConceptMapping: jest.fn(),
    unPopulateAnswer: jest.fn(),
    removeEditedConceptMappingAction: jest.fn(),
    addSelectedSets: jest.fn(),
    selectedSets: [],
    removeSet: jest.fn(),
    createNewSetRow: jest.fn(),
    ...editConceptProps,
  };

  let editConceptWrapper;
  let editConceptComponent;

  beforeEach(() => {
    editConceptWrapper = mount(<Router><EditConcept {...props} /></Router>);
    editConceptComponent = editConceptWrapper.find('EditConcept');
  });

  it('should redirect on confirm cancel', () => {
    localStorage.setItem('dictionaryPathName', '/concepts/users/admin/CCL/CASE CLINIC/en');
    const history = { push: jest.fn() };
    const wrapper = mount(<Router>
      <EditConcept {...props} history={history} />
    </Router>);
    const instance = wrapper.find('EditConcept').instance();
    const spy = jest.spyOn(instance, 'selectConfirm');
    wrapper.find('.btn-danger').at(2).simulate('click');
    wrapper.find('Button #generalConfirmButton').simulate('click');
    expect(spy).toHaveBeenCalled();
    expect(history.push).toHaveBeenCalledWith('/concepts/users/admin/CCL/CASE CLINIC/en');
  });

  it('should not redirect on confirm cancel', () => {
    jest.mock('react-notify-toast');
    notify.show = jest.fn();
    localStorage.removeItem('dictionaryPathName');
    const wrapper = mount(<Router>
      <EditConcept {...props} />
    </Router>);
    const instance = wrapper.find('EditConcept').instance();
    const spy = jest.spyOn(instance, 'selectConfirm');
    wrapper.find('.btn-danger').at(2).simulate('click');
    wrapper.find('Button #generalConfirmButton').simulate('click');
    expect(spy).toHaveBeenCalled();
    expect(notify.show).toHaveBeenCalledWith('An error occurred with your internet connection, please fix it and try reloading the page.', 'error', 3000);
  });

  it('should hide the cancel modal on decline cancel ', () => {
    const wrapper = mount(<Router>
      <EditConcept {...props} />
    </Router>);
    const instance = wrapper.find('EditConcept').instance();
    const spy = jest.spyOn(instance, 'hideModal');
    wrapper.find('.btn-danger').at(2).simulate('click');
    wrapper.find('Button #sub-cancel').simulate('click');
    expect(instance.state.show).toEqual(false);
    expect(spy).toHaveBeenCalled();
  });

  it('should render "Edit a question concept" without breaking', () => {
    const wrapper = mount(<Router>
      <EditConcept {...props} />
    </Router>);
    expect(wrapper.find('h3').text()).toEqual(': Edit a Question Concept ');
    wrapper.unmount();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render other concepts too without breaking', () => {
    const newProps = {
      ...props,
      match: {
        params: {
          collectionName: 'dev-col',
          type: 'users',
          typeName: 'emmabaye',
          language: 'en',
          conceptId: '1',
          name: '',
        },
      },
    };
    const wrapper = mount(<Router>
      <EditConcept {...newProps} />
    </Router>);
    expect(wrapper.find('h3').text()).toEqual(': Edit a Concept ');
    wrapper.unmount();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render with form inputs', () => {
    const wrapper = mount(<Router>
      <EditConcept {...props} />
    </Router>);
    const conceptName = { target: { name: 'name', value: 'test concept' } };
    wrapper.find('#concept-name').simulate('change', conceptName);
    expect(wrapper.find('#concept-name').length).toEqual(1);
    const conceptDatatype = { target: { name: 'datatype', value: 'Text' } };
    wrapper.find('#datatype').simulate('change', conceptDatatype);
    expect(wrapper.find('#datatype').length).toEqual(1);
    const conceptDescription = {
      target: { name: 'description', value: 'test concept description' },
    };
    wrapper.find('#concept-description').simulate('change', conceptDescription);
    expect(wrapper.find('#concept-description').length).toEqual(1);
    expect(wrapper).toMatchSnapshot();
  });
  it('should handle create new name for edit concept', () => {
    const wrapper = mount(<Router>
      <EditConcept {...props} />
    </Router>);
    wrapper.find('#add-more-name').simulate('click');
    expect(props.createNewNameForEditConcept).toHaveBeenCalled();
  });
  it('should handle add description input elements for edit concept', () => {
    const wrapper = mount(<Router>
      <EditConcept {...props} />
    </Router>);
    wrapper.find('#add-more-description').simulate('click');
    expect(props.addDescriptionForEditConcept).toHaveBeenCalled();
  });
  it('should handle remove description input elements for edit concept', () => {
    const wrapper = mount(<Router>
      <EditConcept {...props} />
    </Router>);
    wrapper.find('#remove-description').simulate('click');
    expect(props.removeDescriptionForEditConcept).toHaveBeenCalled();
  });
  it('should handle remove name  elements for edit concept', () => {
    const wrapper = mount(<Router>
      <EditConcept {...props} />
    </Router>);
    wrapper.find('#remove-name').simulate('click');
    expect(props.removeNameForEditConcept).toHaveBeenCalled();
  });

  it('should handle handleUUID', () => {
    const wrapper = mount(<Router>
      <EditConcept {...props} />
    </Router>);
    const event = {
      preventDefault: jest.fn(),
    };
    wrapper.find(EditConcept).instance().handleUUID(event);
    expect(wrapper.find(EditConcept).instance().state.notEditable).toEqual(false);
  });

  it('it should handle submit event', () => {
    const wrapper = mount(<Router><EditConcept {...props} /></Router>);
    const submitForm = wrapper.find('#createConceptForm');
    expect(submitForm.length).toEqual(1);
    wrapper.find('EditConcept').setState(sampleConcept);
    const instance = wrapper.find('EditConcept').instance();
    instance.handleSubmit = jest.fn();
    instance.forceUpdate();
    wrapper.update();
    submitForm.simulate('submit', { preventDefault: jest.fn() });
    expect(instance.handleSubmit).toHaveBeenCalled();
  });

  it('it should handle submit event with invalid uuid', () => {
    jest.mock('react-notify-toast');
    notify.show = jest.fn();
    const wrapper = mount(<Router>
      <EditConcept {...props} />
    </Router>);

    wrapper.find(EditConcept).instance().setState({
      id: '',
    });

    const submitForm = wrapper.find('#createConceptForm');
    submitForm.simulate('submit', {
      preventDefault: () => {},
    });

    expect(notify.show).toHaveBeenCalledWith('enter a valid uuid', 'error', 3000);
  });

  it('it should handle submit event with invalid datatype', () => {
    jest.mock('react-notify-toast');
    notify.show = jest.fn();
    const wrapper = mount(<Router>
      <EditConcept {...props} />
    </Router>);

    wrapper.find(EditConcept).instance().setState({
      datatype: '',
    });

    const submitForm = wrapper.find('#createConceptForm');
    submitForm.simulate('submit', {
      preventDefault: () => {},
    });

    expect(notify.show).toHaveBeenCalledWith('choose a datatype', 'error', 3000);
  });

  it('should test mapStateToProps', () => {
    const initialState = {
      concepts: {
        newName: ['1'],
        description: ['1'],
        newConcept,
        existingConcept,
        disableButton: false,
      },
      sourceConcepts: {
        conceptSources: [],
      },
    };
    expect(mapStateToProps(initialState).description).toEqual(['1']);
    expect(mapStateToProps(initialState).newConcept).toEqual(newConcept);
    expect(mapStateToProps(initialState).newName).toEqual(['1']);
    expect(mapStateToProps(initialState).existingConcept).toEqual(existingConcept);
  });

  it('should show the modal when cancel is clicked with unsaved changes', () => {
    const event = {
      target: {
        name: 'datatype',
        value: 'Complex',
      },
    };
    editConceptWrapper.find('select#datatype').simulate('change', event);
    editConceptWrapper.find('.cancelButton').simulate('click');
    expect(editConceptComponent.instance().state.show).toEqual(true);
  });

  it('should not show the modal when cancel is clicked without unsaved changes', () => {
    const editConceptInstance = editConceptComponent.instance();
    editConceptInstance.oldState = editConceptInstance.state;
    editConceptWrapper.find('.cancelButton').simulate('click');
    expect(editConceptInstance.state.show).toEqual(false);
  });
});

describe('Test suite for mappings on existing concepts', () => {
  const removeSetSpy = jest.fn();
  const createNewSetRowMock = jest.fn();
  const removeConceptMappingActionMock = jest.fn();
  const props = {
    match: {
      params: {
        conceptType: CONCEPT_TYPE.question,
        collectionName: 'dev-col',
        type: 'users',
        typeName: 'emmabaye',
        language: 'en',
        conceptId: '1',
        name: '',
      },
    },
    history: {
      push: jest.fn(),
      goBack: jest.fn(),
    },
    createNewName: jest.fn(),
    addNewDescription: jest.fn(),
    clearSelections: jest.fn(),
    fetchExistingConcept: async () => jest.fn(),
    clearPreviousConcept: jest.fn(),
    createNewNameForEditConcept: jest.fn(),
    removeDescriptionForEditConcept: jest.fn(),
    addDescriptionForEditConcept: jest.fn(),
    removeNameForEditConcept: jest.fn(),
    removeConceptMappingAction: removeConceptMappingActionMock,
    showGeneralModal: jest.fn(),
    hideGeneralModal: jest.fn(),
    confirmRemoveMappingRow: jest.fn(),
    updateConcept: jest.fn(),
    addNewAnswer: jest.fn(),
    removeAnswer: jest.fn(),
    removeSet: removeSetSpy,
    newName: ['1'],
    description: ['1'],
    answer: ['78'],
    loading: false,
    existingConcept: {
      names: [{
        uuid: '12345',
        name: 'dummy',
      }],
      descriptions: [{
        uuid: '1234',
        name: 'dummy',
      }],
      datatype: 'Text',
    },
    newRow: '1234',
    fetchAllConceptSources: jest.fn(),
    allSources: [mockSource],
    addSelectedAnswers: jest.fn(),
    addSelectedSets: jest.fn(),
    selectedAnswers: [{
      frontEndUniqueKey: 'unique', id: 'test ID', map_type: 'Q-AND-A', prePopulated: false,
    }],
    selectedSets: [{
      frontEndUniqueKey: 'unique', id: 'test ID', map_type: MAP_TYPE.conceptSet, prePopulated: false,
    }],
    createNewAnswerRow: jest.fn(),
    removeEditedConceptMappingAction: jest.fn(),
    unPopulateAnswer: jest.fn(),
    removeCurrentAnswer: jest.fn(),
    createNewSetRow: createNewSetRowMock,
    ...editConceptProps,
  };
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<Router>
      <EditConcept {...props} />
    </Router>);
  });

  it('should call addMappingRow function', () => {
    const instance = wrapper.find('EditConcept').instance();
    instance.addMappingRow();
    expect(instance.state.mappings.length).toEqual(1);
  });

  it('should call removeConceptMappingAction function', () => {
    const url = '9999';
    const instance = wrapper.find('EditConcept').instance();
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
    expect(instance.state.mappings.filter(_ => _ != null).length).toEqual(1);
  });

  it('should correctly set an unsaved mapping as retired', () => {
    const url = '9999';
    const instance = wrapper.find('EditConcept').instance();
    instance.state.mappings[0] = {
      map_type: 'Same as',
      source: INTERNAL_MAPPING_DEFAULT_SOURCE,
      to_concept_code: null,
      to_concept_name: null,
      id: 3,
      to_source_url: null,
      isNew: true,
      retired: false,
      url: '101010',
    };
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
    instance.removeUnsavedMappingRow(url);
    expect(instance.state.mappings[0].retired).toEqual(false);
    expect(instance.state.mappings[1].retired).toEqual(true);
  });

  it('should call removeMappingRow function', () => {
    const url = '9999';
    const instance = wrapper.find('EditConcept').instance();
    instance.state.mappings[1] = {
      map_type: 'Same as',
      source: INTERNAL_MAPPING_DEFAULT_SOURCE,
      to_concept_code: null,
      to_concept_name: null,
      id: 3,
      to_source_url: null,
      retired: false,
      url: '9999',
      isEditConcept: true,
    };
    const spy = jest.spyOn(instance, 'showGeneralModal');
    instance.removeMappingRow(url);
    expect(spy).toHaveBeenCalled();
  });

  it('should show the delete modal', () => {
    const url = '9999';
    const instance = wrapper.find('EditConcept').instance();
    instance.state.mappings[1] = {
      map_type: 'Same as',
      source: INTERNAL_MAPPING_DEFAULT_SOURCE,
      to_concept_code: null,
      to_concept_name: null,
      id: 3,
      to_source_url: null,
      retired: false,
      url: '9999',
      isEditConcept: true,
    };
    instance.removeMappingRow(url);
    expect(instance.state.openGeneralModal).toEqual(true);
  });

  it('should call confirmRemoveMappingRow', () => {
    const url = '9999';
    const instance = wrapper.find('EditConcept').instance();
    instance.state.mappings[1] = {
      map_type: 'Same as',
      source: INTERNAL_MAPPING_DEFAULT_SOURCE,
      to_concept_code: null,
      to_concept_name: null,
      id: 3,
      to_source_url: null,
      retired: false,
      url: '9999',
      isEditConcept: true,
    };
    const spy = jest.spyOn(instance, 'confirmRemoveMappingRow');
    instance.removeMappingRow(url);
    wrapper.find('.btn-danger').at(0).simulate('click');
    wrapper.find('Button #generalConfirmButton').simulate('click');
    expect(spy).toHaveBeenCalled();
    expect(props.removeConceptMappingAction).toHaveBeenCalled();
  });

  describe('EditConcept', () => {
    it('should call removeConceptMappingAction and removeSet', () => {
      const instance = wrapper.find('EditConcept').instance();
      removeSetSpy.mockClear();
      removeConceptMappingActionMock.mockClear();
      instance.confirmRemoveSetRow('uniqueKey').then(() => {
        expect(removeSetSpy).toHaveBeenCalledWith('uniqueKey');
        expect(removeConceptMappingActionMock).toHaveBeenCalled();
      });
    });
  });

  it('should hide the delete modal', () => {
    const url = '9999';
    const instance = wrapper.find('EditConcept').instance();
    instance.state.mappings[1] = {
      map_type: 'Same as',
      source: INTERNAL_MAPPING_DEFAULT_SOURCE,
      to_concept_code: null,
      to_concept_name: null,
      id: 3,
      to_source_url: null,
      retired: false,
      url: '9999',
      isEditConcept: true,
    };
    const spy = jest.spyOn(instance, 'hideGeneralModal');
    instance.removeMappingRow(url);
    wrapper.find('.btn-danger').at(0).simulate('click');
    wrapper.find('Button #sub-cancel').simulate('click');
    expect(spy).toHaveBeenCalled();
  });

  it('should set the event value to right the mapping in state', (done) => {
    const event = {
      target: {
        tabIndex: 0,
        name: 'to_concept_name',
        value: 'newConceptName',
      },
    };
    const mockMapping = newMappings[0];

    const existingMappings = [
      mockMapping,
      { ...mockMapping, url: 'doesNotExist' },
    ];

    const instance = wrapper.find('EditConcept').instance();

    instance.setState({ mappings: existingMappings }, () => {
      instance.updateEventListener(event, mockMapping.url);
      expect(instance.state.mappings[0].to_concept_name).toEqual(event.target.value);
      done();
    });
  });

  it('should test componentWillReceiveProps', () => {
    const newProps = {
      existingConcept: {
        mappings: [
          {
            id: 1,
            map_type: 'Same as',
            source: INTERNAL_MAPPING_DEFAULT_SOURCE,
            to_concept_code: 'dce20834-a9d7-41c6-be70-587f5246d41a',
            to_concept_name: 'MALARIA SMEAR, QUALITATIVE',
            to_source_url: '/orgs/CIEL/sources/CIEL/concepts/1366/',
            isNew: false,
          },
          {
            map_type: 'Narrower than',
            source: INTERNAL_MAPPING_DEFAULT_SOURCE,
            to_concept_code: '67c0bc01-4f16-4424-80fd-f08b122bcef2',
            to_concept_name: 'MALARIA DIAGNOSIS IN THE LAST TWELVE MONTHS',
            to_source_url: CIEL_SOURCE_URL,
            isNew: true,
          },
          {
            id: 3,
            map_type: 'Same as',
            source: 'SNOMED',
            to_concept_code: '92eebf0a-df73-4c17-985f-0347c7dee768',
            to_concept_name: 'malaria',
            to_source_url: null,
            isNew: false,
          },
        ],
      },
    };
    const instance = wrapper.find('EditConcept').instance();
    instance.componentWillReceiveProps({ existingConcept: { mappings: undefined } });
    instance.componentWillReceiveProps(newProps);
    expect(instance.state.source).toEqual(INTERNAL_MAPPING_DEFAULT_SOURCE);
  });

  it('should update the state with answers', () => {
    const instance = wrapper.find('EditConcept').instance();
    const spy = jest.spyOn(instance, 'handleAsyncSelectChange');
    instance.handleAsyncSelectChange();
    expect(spy).toHaveBeenCalled();
  });

  it('should update the state with sets', () => {
    const instance = wrapper.find('EditConcept').instance();
    instance.handleSetAsyncSelectChange({ a: 1 }, 1);
    expect(instance.state.sets).toEqual([{
      frontEndUniqueKey: 'unique', id: 'test ID', map_type: MAP_TYPE.conceptSet, prePopulated: false,
    }]);
  });

  it('should add new answer row', () => {
    const instance = wrapper.find('EditConcept').instance();
    const spy = jest.spyOn(instance, 'addAnswerRow');
    instance.addAnswerRow();
    expect(spy).toHaveBeenCalled();
  });

  describe('addSetRow', () => {
    it('properly calls createNewSetRow', () => {
      const instance = wrapper.find('EditConcept').instance();
      createNewSetRowMock.mockClear();
      instance.addSetRow();
      expect(createNewSetRowMock).toHaveBeenCalled();
    });
  });

  it('should remove answer row', () => {
    const instance = wrapper.find('EditConcept').instance();
    const spy = jest.spyOn(instance, 'removeAnswerRow');
    instance.removeAnswerRow('uniqueKey', true, 'url', 'name', 'code', true);
    expect(spy).toHaveBeenCalled();
  });

  describe('remove set row', () => {
    it('should correctly set the state', () => {
      const instance = wrapper.find('EditConcept').instance();
      instance.removeSetRow(1, true, '/url', 'name', true);
      expect(instance.state.deletingSet).toBeTruthy();
      expect(instance.state.setToDeleteName).toEqual('name');
      expect(instance.state.uniqueKey).toEqual(1);
    });

    it('should call remove set when either editing or prePopulated are false', () => {
      const instance = wrapper.find('EditConcept').instance();
      removeSetSpy.mockClear();
      instance.removeSetRow(1, true, '/url', 'name', false);
      expect(removeSetSpy).toHaveBeenCalledWith(1);
    });
  });

  it('should call removeAnswer and remove the anwser row when a user clicks the remove button while creating a Q-A concept', () => {
    wrapper.find('.answer button#removeAnswer').simulate('click');
    expect(props.removeAnswer).toHaveBeenCalledWith(props.selectedAnswers[0].frontEndUniqueKey);
  });
  it('should set `NARROWER-THAN` as the default relationship when the source is changed to `Datatype`'
  + 'while editing a concept', () => {
    const event = {
      target: {
        tabIndex: 0,
        name: 'source',
        value: '',
      },
    };
    const url = '1435';
    const instance = wrapper.find('EditConcept').instance();
    instance.state.mappings = newMappings;
    instance.state.mappings[0] = {
      source: 'Datatype',
      url: '1435',
    };
    instance.updateSourceEventListener(event, url, { url: '/not/ciel' });
    expect(instance.state.mappings[0].map_type).toEqual('NARROWER-THAN');
  });
  it('should set `SAME-AS` as the default relationship when the source is changed to `CIEL`'
  + 'while editing a concept', (done) => {
    const event = {
      target: {
        tabIndex: 0,
        name: 'source',
        value: CIEL_SOURCE_URL,
      },
    };
    const url = '1234';
    const instance = wrapper.find('EditConcept').instance();
    instance.state.mappings[1] = {
      url,
    };

    instance.setState(
      {
        mappings: [{ ...newMappings[0], url: 'doesNotExist' }, { url }],
      },
      () => {
        instance.updateSourceEventListener(event, url, { url: CIEL_SOURCE_URL });
        expect(instance.state.mappings[1].map_type).toEqual('SAME-AS');
        done();
      },
    );
  });

  it('should call removeEditedConceptMappingAction function to remove mapping', () => {
    const newProps = {
      ...props,
      updateConcept: jest.fn().mockResolvedValueOnce(false),
    };
    wrapper = mount(<Router><EditConcept {...newProps} /></Router>);
    const answerUrl = 'url';
    const frontEndUniqueKey = 'unique';
    const answer = {};
    const info = { answerUrl, frontEndUniqueKey, answer };
    const instance = wrapper.find('EditConcept').instance();
    instance.removeCurrentAnswer(info);
    const submitForm = wrapper.find('#createConceptForm');
    submitForm.simulate('submit', { preventDefault: jest.fn() });
    expect(props.removeEditedConceptMappingAction)
      .toHaveBeenCalledWith({ references: [answerUrl] });
  });

  it('should redirect user to previous page when concept update is successfull', () => {
    const newProps = {
      ...props,
      updateConcept: jest.fn().mockResolvedValueOnce(true),
    };

    const editWrapper = mount(<EditConcept {...newProps} />);
    const instance = editWrapper.instance();
    props.history.goBack.mockClear();
    instance.updateConceptReference = jest.fn().mockResolvedValueOnce(true);

    expect(newProps.updateConcept).not.toHaveBeenCalled();
    expect(instance.updateConceptReference).not.toHaveBeenCalled();
    expect(props.history.goBack).not.toHaveBeenCalled();

    instance.handleSubmit({ preventDefault: jest.fn() });

    setImmediate(() => {
      expect(newProps.updateConcept).toHaveBeenCalled();
      expect(instance.updateConceptReference).toHaveBeenCalled();
      expect(props.history.goBack).toHaveBeenCalled();
    });
  });

  describe('updateConceptReference', () => {
    it('should return true on success', async () => {
      const listMappingsFromAConceptInASourceMock = jest.fn(() => []);
      listMappingsFromAConceptInASourceMock.mockResolvedValueOnce({
        data: [mockMappings[0]],
      });
      const addReferencesToCollectionMock = jest.fn();
      addReferencesToCollectionMock.mockResolvedValue({
        data: {
          added: true,
        },
      });
      api.mappings.list.fromAConceptInASource = listMappingsFromAConceptInASourceMock;
      api.dictionaries.addReferencesToCollection = addReferencesToCollectionMock;

      const editConceptInstance = wrapper.find('EditConcept').instance();
      expect(await editConceptInstance.updateConceptReference(sampleConcept)).toBeTruthy();
    });

    it('should return false on delete reference failure', async () => {
      const editConceptWrapper = mount(<Router>
        <EditConcept
          {...props}
          deleteReferenceFromCollection={() => false}
        />
      </Router>);
      const editConceptInstance = editConceptWrapper.find('EditConcept').instance();
      expect(await editConceptInstance.updateConceptReference(sampleConcept)).toBeFalsy();
    });

    it('should return false on add reference failure', async () => {
      const listMappingsFromAConceptInASourceMock = jest.fn(() => []);
      listMappingsFromAConceptInASourceMock.mockResolvedValueOnce({
        data: [mockMappings[0]],
      });
      const addReferencesToCollectionMock = jest.fn();
      addReferencesToCollectionMock.mockRejectedValueOnce({ response: 'bad request' });

      api.mappings.list.fromAConceptInASource = listMappingsFromAConceptInASourceMock;
      api.dictionaries.addReferencesToCollection = addReferencesToCollectionMock;

      const editConceptWrapper = mount(<Router>
        <EditConcept
          {...props}
          addReferenceToCollection={() => false}
        />
      </Router>);
      const editConceptInstance = editConceptWrapper.find('EditConcept').instance();
      expect(await editConceptInstance.updateConceptReference(sampleConcept)).toBeFalsy();
    });
  });
  it('should update container state when props change', () => {
    const editWrapper = mount(<EditConcept {...props} />);
    const instance = editWrapper.instance();
    const spy = jest.spyOn(instance, 'componentDidUpdate');
    const newProps = {
      existingConcept: {
        ...props.existingConcept,
        datatype: 'Boolean',
      },
    };
    editWrapper.setProps(newProps);
    expect(spy).toHaveBeenCalled();
    expect(instance.state.datatype).toEqual(newProps.existingConcept.datatype);
  });

  describe('unRetireExistingMappings', () => {
    it('should call unRetireMapping with the right mapping url', async () => {
      const newProps = {
        ...props,
        unretireMapping: jest.fn(),
      };

      const mockConcept = newMappings[0];
      const freshMappings = [
        { ...mockConcept, isNew: true },
        { ...mockConcept, isNew: true, to_concept_code: 'newConceptCode' },
      ];
      const retired = [
        { ...mockMappings[0], to_concept_code: mockConcept.to_concept_code, retired: true },
      ];

      const editWrapper = mount(<EditConcept {...newProps} />);
      const instance = editWrapper.instance();

      expect(newProps.unretireMapping).not.toHaveBeenCalled();
      await instance.unRetireExistingMappings(freshMappings, retired);
      expect(newProps.unretireMapping).toHaveBeenCalledWith(retired[0].url);
    });
  });
});
