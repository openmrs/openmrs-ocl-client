import React from 'react';
import { shallow } from 'enzyme';
import AnswersRow from '../../../components/dictionaryConcepts/components/AnswersRow';
import answers from '../../__mocks__/answers';
import { existingConcept } from '../../__mocks__/concepts';

const props = {
  pathName: {
    language: 'en',
  },
  answer: answers,
  addNewAnswer: jest.fn(),
  removeAnswer: jest.fn(),
  removeDataFromRow: jest.fn(),
  addDataFromAnswer: jest.fn(),
  existingConcept: {
    existingConcept,
  },
  newConcept: [],
  names: [],
  newRow: {
    uuid: 4566,
  },

};

describe('Test suite for AnswersRows ', () => {
  it('should render AnswersRows  Component', () => {
    const wrapper = shallow(<AnswersRow {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should handle remove', () => {
    const fakeEvent = { preventDefault: () => {} };
    const wrapper = shallow(<AnswersRow {...props} />);
    const spy = jest.spyOn(wrapper.instance(), 'handleRemove');
    wrapper.find('.concept-form-table-link.answer').simulate('click', fakeEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('should handle change on the text input', () => {
    const wrapper = shallow(<AnswersRow {...props} />);
    const spy = jest.spyOn(wrapper.instance(), 'handleChange');
    wrapper.setState({
      names: [],
      description: [],
      answer: [],
    });
    const event = {
      target: {
        value: '/users/nesh/sources/test/concepts/2140db25-4d4a-4804-90cc-6fd8328dfe9e/',
      },
    };
    wrapper.find('input.form-control.answer').at(0).simulate('change', event);
    expect(spy).toHaveBeenCalled();
  });

  it('should handle componentDidUpdate', () => {
    const newState = {
      answer: '/test/test/',
    };
    const wrapper = shallow(<AnswersRow {...props} />);
    const spy = jest.spyOn(wrapper.instance(), 'sendToTopComponent');
    wrapper.setProps(props);
    wrapper.setState(newState);
    expect(spy).toHaveBeenCalled();
  });
});
