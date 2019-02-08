import React from 'react';
import { mount } from 'enzyme';
import Router from 'react-mock-router';
import CreateMapping from '../../../components/dictionaryConcepts/components/CreateMapping';
import { INTERNAL_MAPPING_DEFAULT_SOURCE } from '../../../components/dictionaryConcepts/components/helperFunction';

describe('Test suite for dictionary concepts components', () => {
  const props = {
    map_type: 'same as',
    source: INTERNAL_MAPPING_DEFAULT_SOURCE,
    to_concept_code: '674647-75775',
    to_concept_name: 'malaria',
    index: 1,
    updateEventListener: jest.fn(),
    removeMappingRow: jest.fn(),
    updateAsyncSelectValue: jest.fn(),
  };

  let wrapper = mount(<Router>
    <table>
      <tbody><CreateMapping {...props} /></tbody>
    </table>
  </Router>);

  it('should call handleInputChange', () => {
    const instance = wrapper.find('CreateMapping').instance();
    instance.handleInputChange('malaria');
  });

  it('should call updateEventListener', () => {
    const newProps = {
      ...props,
      source: 'SNOMED',
    };

    wrapper = mount(<Router>
      <table>
        <tbody><CreateMapping {...newProps} /></tbody>
      </table>
    </Router>);

    const inputField = wrapper.find('CreateMapping');
    inputField.find('#to_concept_code').simulate('change');
    expect(props.updateEventListener).toHaveBeenCalled();
  });

  it('should call removeMappingRow and remove row', () => {
    const inputField = wrapper.find('CreateMapping');
    inputField.find('#remove').first().simulate('click');
    expect(props.removeMappingRow).toHaveBeenCalled();
  });

  it('should render when isNew is true and source not CIEL', () => {
    const newProps = {
      ...props,
      isNew: true,
      source: 'Snomed',
    };

    wrapper = mount(<Router>
      <table><tbody><CreateMapping {...newProps} /></tbody></table>
    </Router>);
    const inputs = wrapper.find('input');
    expect(inputs).toHaveLength(3);
  });

  it('should render when isNew is true and source equal to CIEL', () => {
    const newProps = {
      ...props,
      isNew: true,
    };

    wrapper = mount(<Router>
      <table><tbody><CreateMapping {...newProps} /></tbody></table>
    </Router>);
  });
  const inputs = wrapper.find('select');
  expect(inputs).toHaveLength(1);
});
