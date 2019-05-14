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
import { INTERNAL_MAPPING_DEFAULT_SOURCE, CIEL_SOURCE_URL, CONCEPT_TYPE } from '../../../components/dictionaryConcepts/components/helperFunction';

jest.mock('uuid/v4', () => jest.fn(() => '1234'));
jest.mock('react-notify-toast');

localStorage.setItem('dictionaryPathName', '/');

const editConceptProps = {
  deleteConcept: jest.fn(),
  recreateConcept: async () => jest.fn(),
  unretireMapping: jest.fn(),
  dictionaryConcepts: [sampleConcept],
  updateConcept: async () => sampleConcept,
  existingConcept: sampleConcept,
  isEditConcept: true,
  deleteReferenceFromCollection: () => true,
  addReferenceToCollection: () => true,
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
    const spy = jest.spyOn(instance, 'handleSubmit');
    instance.forceUpdate();
    wrapper.update();
    submitForm.simulate('submit', { preventDefault: jest.fn() });
    expect(spy).toHaveBeenCalled();
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
    showGeneralModal: jest.fn(),
    hideGeneralModal: jest.fn(),
    confirmRemoveMappingRow: jest.fn(),
    updateConcept: jest.fn(),
    addNewAnswer: jest.fn(),
    removeAnswer: jest.fn(),
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
    },
    newRow: '1234',
    fetchAllConceptSources: jest.fn(),
    allSources: [mockSource],
    addSelectedAnswers: jest.fn(),
    selectedAnswers: [{
      frontEndUniqueKey: 'unique', id: 'test ID', map_type: 'Q-AND-A', prePopulated: false,
    }],
    createNewAnswerRow: jest.fn(),
    removeEditedConceptMappingAction: jest.fn(),
    unPopulateAnswer: jest.fn(),
    removeCurrentAnswer: jest.fn(),
    ...editConceptProps,
  };
  const wrapper = mount(<Router>
    <EditConcept {...props} />
  </Router>);

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

  it('should call removeUnsavedMappingRow function', () => {
    const url = '9999';
    const instance = wrapper.find('EditConcept').instance();
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

  it('should call updateAsyncSelectValue function', () => {
    const value = { index: '1234', value: 'malaria 1', label: 'malaria 1' };
    const instance = wrapper.find('EditConcept').instance();
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
    const instance = wrapper.find('EditConcept').instance();
    instance.updateEventListener({ target: { tabIndex: 0, name: INTERNAL_MAPPING_DEFAULT_SOURCE, value: '' } });
    instance.updateEventListener(event, url);
    expect(instance.state.mappings[0].to_concept_code).not.toEqual(null);
  });

  it('should call updateEventListener function on source change', () => {
    const event = {
      target: {
        tabIndex: 0,
        name: 'source',
        value: '',
      },
    };
    const url = '1234';
    const { value } = event.target;
    const instance = wrapper.find('EditConcept').instance();
    const spy = jest.spyOn(instance, 'updateEventListener');
    instance.updateEventListener({ target: { tabIndex: 0, name: INTERNAL_MAPPING_DEFAULT_SOURCE, value: '' } });
    instance.updateEventListener(event, url);
    wrapper.find('.form-control').at(0).simulate('select');
    expect(spy).toHaveBeenCalled();
    expect(instance.state.mappings[0].to_concept_code).toEqual(value);
  });

  it('should call updateEventListener function with internal mapping', () => {
    const event = {
      target: {
        tabIndex: 0,
        name: 'to_concept_name',
        value: INTERNAL_MAPPING_DEFAULT_SOURCE,
      },
    };
    const instance = wrapper.find('EditConcept').instance();
    const spy = jest.spyOn(instance, 'updateEventListener');
    instance.updateEventListener(event);
    expect(spy).toHaveBeenCalled();
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

  it('should add new answer row', () => {
    const instance = wrapper.find('EditConcept').instance();
    const spy = jest.spyOn(instance, 'addAnswerRow');
    instance.addAnswerRow();
    expect(spy).toHaveBeenCalled();
  });

  it('should remove answer row', () => {
    const instance = wrapper.find('EditConcept').instance();
    const spy = jest.spyOn(instance, 'removeAnswerRow');
    instance.removeAnswerRow('uniqueKey', true, 'url', 'name', 'code', true);
    expect(spy).toHaveBeenCalled();
  });
  it('should call removeAnswer and remove the anwser row when a user clicks the remove button while creating a Q-A concept', () => {
    wrapper.find('button#removeAnswer').simulate('click');
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
    instance.updateSourceEventListener(event, url);
    expect(instance.state.mappings[0].map_type).toEqual('NARROWER-THAN');
  });
  it('should set `SAME-AS` as the default relationship when the source is changed to `CIEL`'
  + 'while editing a concept', () => {
    const event = {
      target: {
        tabIndex: 0,
        name: 'source',
        value: 'a234',
      },
    };
    const url = '1234';
    const instance = wrapper.find('EditConcept').instance();
    instance.state.mappings[1] = {
      source: INTERNAL_MAPPING_DEFAULT_SOURCE,
    };
    instance.updateSourceEventListener(event, url);
    expect(instance.state.mappings[1].map_type).toEqual('SAME-AS');
  });

  it('should call removeEditedConceptMappingAction function to remove mapping', () => {
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

  describe('updateConceptReference', () => {
    it('should return true on success', async () => {
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
});
