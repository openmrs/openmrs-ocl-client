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
        locale_preferred: true,
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
        locale_preferred: false,
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
    expect(wrapper.find('#locale_preferred').props().value).toEqual(newProps.newRow.locale_preferred ? 'Yes' : 'No');
  });

  it('should update state with the right values from the props', () => {
    const newProps = {
      ...props,
      newRow: {
        id: '5',
        name: 'testing',
        locale: 'la',
        locale_full: { value: 'en', label: 'English [en]' },
        locale_preferred: 'No',
        name_type: 'test',
        external_id: 'externalId',
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
    const instance = wrapper.find('ConceptNameRows').instance();
    expect(instance.state.external_id).toEqual(newProps.newRow.external_id);
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

  it('should update state and call sendToTopComponent when the locale_preferred is updated', () => {
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
    const spy = jest.spyOn(instance, 'sendToTopComponent');

    expect(spy).not.toHaveBeenCalled();
    instance.handleChange({ target: { name: 'locale_preferred', value: 'Yes' } });
    expect(instance.state.locale_preferred).toEqual(true);

    instance.handleChange({ target: { name: 'locale_preferred', value: 'No' } });
    expect(instance.state.locale_preferred).toEqual(false);

    expect(spy).toHaveBeenCalled();
  });

  it('should update the name_type in state with null when a synonym is selected and the selected value otherwise', () => {
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
    const spy = jest.spyOn(instance, 'sendToTopComponent');

    expect(spy).not.toHaveBeenCalled();
    instance.handleChange({ target: { name: 'name_type', value: 'null' } });
    expect(instance.state.name_type).toEqual(null);

    instance.handleChange({ target: { name: 'name_type', value: 'Fully Specified' } });
    expect(instance.state.name_type).toEqual('Fully Specified');

    expect(spy).toHaveBeenCalled();
  });
});
