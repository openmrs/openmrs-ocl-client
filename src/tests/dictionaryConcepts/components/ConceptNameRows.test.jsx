import React from 'react';
import { shallow, mount } from 'enzyme';
import ConceptNameRows from '../../../components/dictionaryConcepts/components/ConceptNameRows';


describe('Test suite for ConceptNameRows ', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      pathName: {
        language: 'en',
      },
      addDataFromRow: jest.fn(),
      removeRow: jest.fn(),
      removeDataFromRow: jest.fn(),
      newRow: {
        uuid: '123',
      },
    };
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('should render ConceptNameRows  Component', () => {
    wrapper = shallow(<ConceptNameRows {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should call addDataFromRow with the concept data', () => {
    const newProps = {
      ...props,
      newRow: {
        id: '5',
        name: 'testing',
        locale_full: { value: 'en', label: 'English [en]' },
        name_type: 'test',
      },
      locale: ['fr', 'sw'],
      existingConcept: {
        id: 9,
      },
    };
    wrapper = mount(<table><tbody><ConceptNameRows {...newProps} /></tbody></table>);
    const instance = wrapper.find('ConceptNameRows').instance();
    const event = {
      target: {
        value: 'typhoid',
      },
    };
    const spy = jest.spyOn(instance, 'sendToTopComponent');
    instance.handleChange(event);
    expect(spy).toHaveBeenCalled();
    expect(props.addDataFromRow).toHaveBeenCalledWith(instance.state);
  });

  it('should render ConceptNameRows Component with a new row', () => {
    const newProps = {
      ...props,
      newRow: {
        id: '5',
        name: 'testing',
        locale: 'la',
        locale_full: { value: 'en', label: 'English [en]' },
        locale_preferred: 'No',
        name_type: 'test',
      },
      index: 0,
      nameRows: [],
      rowId: '3',
      locale: ['fr', 'sw'],
      existingConcept: {
        id: 9,
      },
    };
    wrapper = mount(<table><tbody><ConceptNameRows {...newProps} /></tbody></table>);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.length).toBe(1);
    expect(wrapper.find('#concept-name').props().value).toEqual(newProps.newRow.name);
  });

  it('should call update state with selected value when handleNameLocale is invoked', () => {
    const newProps = {
      ...props,
      newRow: {
        id: '5',
        name: 'testing',
        locale_full: { value: 'en', label: 'English [en]' },
        name_type: 'test',
      },
      locale: ['fr', 'sw'],
      existingConcept: {
        id: 9,
      },
    };
    wrapper = mount(<table><tbody><ConceptNameRows {...newProps} /></tbody></table>);
    const instance = wrapper.find('ConceptNameRows').instance();
    const selectedOptions = {
      value: 'typhoid',
    };
    const spy = jest.spyOn(instance, 'sendToTopComponent');
    instance.handleNameLocale(selectedOptions);
    expect(spy).toHaveBeenCalled();
    expect(instance.state.locale).toEqual(selectedOptions.value);
    expect(instance.state.locale_full).toEqual(selectedOptions);
  });
});
