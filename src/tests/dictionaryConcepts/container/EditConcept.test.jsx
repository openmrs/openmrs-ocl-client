import React from 'react';
import { mount } from 'enzyme';
import Router from 'react-mock-router';
import { notify } from 'react-notify-toast';
import {
  EditConcept,
  mapStateToProps,
} from '../../../components/dictionaryConcepts/containers/EditConcept';
import { newConcept, existingConcept } from '../../__mocks__/concepts';
import { INTERNAL_MAPPING_DEFAULT_SOURCE, CIEL_SOURCE_URL } from '../../../components/dictionaryConcepts/components/helperFunction';

jest.mock('uuid/v4', () => jest.fn(() => 1234));
jest.mock('react-notify-toast');

localStorage.setItem('dictionaryPathName', '/');

describe('Test suite for dictionary concepts components', () => {
  const props = {
    match: {
      params: {
        conceptType: 'question',
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
    fetchExistingConcept: jest.fn(),
    clearPreviousConcept: jest.fn(),
    createNewNameForEditConcept: jest.fn(),
    removeDescriptionForEditConcept: jest.fn(),
    addDescriptionForEditConcept: jest.fn(),
    removeNameForEditConcept: jest.fn(),
    updateConcept: jest.fn(),
    addNewAnswer: jest.fn(),
    removeAnswer: jest.fn(),
    newName: ['1'],
    description: ['1'],
    answer: ['78'],
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
  };
  it('should render without breaking', () => {
    const wrapper = mount(<Router>
      <EditConcept {...props} />
    </Router>);
    expect(wrapper.find('h3').text()).toEqual(': Edit a question Concept ');
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
    const wrapper = mount(<Router>
      <EditConcept {...props} />
    </Router>);
    const submitForm = wrapper.find('#createConceptForm');
    expect(submitForm.length).toEqual(1);
    submitForm.simulate('submit', {
      preventDefault: () => {},
    });
    expect(props.updateConcept).toHaveBeenCalled();
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
    };
    expect(mapStateToProps(initialState).description).toEqual(['1']);
    expect(mapStateToProps(initialState).newConcept).toEqual(newConcept);
    expect(mapStateToProps(initialState).newName).toEqual(['1']);
    expect(mapStateToProps(initialState).existingConcept).toEqual(existingConcept);
  });
});

describe('Test suite for mappings on existing concepts', () => {
  const props = {
    match: {
      params: {
        conceptType: 'question',
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
    fetchExistingConcept: jest.fn(),
    clearPreviousConcept: jest.fn(),
    createNewNameForEditConcept: jest.fn(),
    removeDescriptionForEditConcept: jest.fn(),
    addDescriptionForEditConcept: jest.fn(),
    removeNameForEditConcept: jest.fn(),
    updateConcept: jest.fn(),
    addNewAnswer: jest.fn(),
    removeAnswer: jest.fn(),
    newName: ['1'],
    description: ['1'],
    answer: ['78'],
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
  };
  const wrapper = mount(<Router>
    <EditConcept {...props} />
  </Router>);

  it('should call addMappingRow function', () => {
    const instance = wrapper.find('EditConcept').instance();
    instance.addMappingRow();
    expect(instance.state.mappings.length).toEqual(1);
  });

  it('should call removeMappingRow function', () => {
    const event = { target: { tabIndex: 1 } };
    const instance = wrapper.find('EditConcept').instance();
    instance.addMappingRow();
    expect(instance.state.mappings.filter(_ => _ != null).length).toEqual(2);
    instance.removeMappingRow(event);
    expect(instance.state.mappings.filter(_ => _ != null).length).toEqual(1);
  });

  it('should call updateAsyncSelectValue function', () => {
    const value = { index: 0, value: 'malaria 1', label: 'malaria 1' };
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
    const instance = wrapper.find('EditConcept').instance();
    instance.updateEventListener({ target: { tabIndex: 0, name: INTERNAL_MAPPING_DEFAULT_SOURCE, value: '' } });
    instance.updateEventListener(event);
    expect(instance.state.mappings[0].to_concept_code).not.toEqual(null);
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
});
