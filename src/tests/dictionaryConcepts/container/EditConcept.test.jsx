import React from 'react';
import { mount } from 'enzyme';
import Router from 'react-mock-router';
import {
  EditConcept,
  mapStateToProps,
} from '../../../components/dictionaryConcepts/containers/EditConcept';
import { newConcept, existingConcept } from '../../__mocks__/concepts';

jest.mock('uuid/v4', () => jest.fn(() => 1234));
jest.mock('react-notify-toast');

global.localStorage = {
  getItem: () => '/',
};

describe('Test suite for dictionary concepts components', () => {
  const props = {
    match: {
      params: {
        conceptType: 'diagnosis',
        collectionName: 'dev-col',
        type: 'users',
        typeName: 'emmabaye',
        language: 'en',
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
    newName: ['1'],
    description: ['1'],
    existingConcept: {
      names: [{
        uuid: '1234',
      }],
      descriptions: [{
        uuid: '1234',
      }],
    },
  };
  it('should render without breaking', () => {
    const wrapper = mount(<Router>
      <EditConcept {...props} />
    </Router>);
    expect(wrapper.find('h3').text()).toEqual(': Edit a diagnosis Concept ');
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
  it('should test mapStateToProps', () => {
    const initialState = {
      concepts: {
        newName: ['1'],
        description: ['1'],
        newConcept,
        existingConcept,
      },
    };
    expect(mapStateToProps(initialState).description).toEqual(['1']);
    expect(mapStateToProps(initialState).newConcept).toEqual(newConcept);
    expect(mapStateToProps(initialState).newName).toEqual(['1']);
    expect(mapStateToProps(initialState).existingConcept).toEqual(existingConcept);
  });
});
