import React from 'react';
import { mount } from 'enzyme';
import Router from 'react-mock-router';
import { notify } from 'react-notify-toast';
import {
  EditConcept,
  mapStateToProps,
} from '../../../components/dictionaryConcepts/containers/EditConcept';
import { newConcept, existingConcept } from '../../__mocks__/concepts';

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

  it('should handle add-more-answers', () => {
    const wrapper = mount(<Router>
      <EditConcept {...props} />
    </Router>);
    wrapper.find('.add-more-answers').simulate('click');
    expect(props.addNewAnswer).toHaveBeenCalled();
  });

  it('should handle remove-answers', () => {
    const wrapper = mount(<Router>
      <EditConcept {...props} />
    </Router>);
    wrapper.find('.concept-form-table-link.answer').simulate('click');
    expect(props.removeAnswer).toHaveBeenCalled();
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

  it('should handle add data from answer', () => {
    const wrapper = mount(<Router>
      <EditConcept {...props} />
    </Router>);
    const conceptAnswer = { target: { name: 'answer', value: 'test concept' } };
    wrapper.find('#concept-answer').simulate('change', conceptAnswer);
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
      },
    };
    expect(mapStateToProps(initialState).description).toEqual(['1']);
    expect(mapStateToProps(initialState).newConcept).toEqual(newConcept);
    expect(mapStateToProps(initialState).newName).toEqual(['1']);
    expect(mapStateToProps(initialState).existingConcept).toEqual(existingConcept);
  });
});
