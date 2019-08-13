import React from 'react';
import { MemoryRouter as Router } from 'react-router';
import { mount } from 'enzyme';
import concept from '../../__mocks__/concepts';
import mapping from '../../__mocks__/mappings';
import ViewConcept from '../../../components/dictionaryConcepts/components/ViewConcept';
import { MAP_TYPE } from '../../../components/dictionaryConcepts/components/helperFunction';

const props = {
  concept,
  qaMappings: [{ ...mapping, map_type: MAP_TYPE.questionAndAnswer }],
  setMappings: [mapping],
  otherMappings: [mapping],
};

describe('ViewConcept', () => {
  it('it should display the concepts fields', () => {
    const viewConcept = mount(<Router><ViewConcept {...props} /></Router>);
    expect(viewConcept.find('#external-id').text()).toEqual(props.concept.external_id);
    expect(viewConcept.find('#id').text()).toEqual(props.concept.id);
    expect(viewConcept.find('#class').text()).toEqual(props.concept.concept_class);
    expect(viewConcept.find('#version-id').text()).toEqual(props.concept.uuid);
    expect(viewConcept.find('#datatype').text()).toEqual(props.concept.datatype);
    expect(viewConcept.exists('#descriptions')).toBeTruthy();
  });

  it('should display none under descriptions if they are not available', () => {
    const newProps = {
      ...props,
      concept: {
        ...props.concept,
        descriptions: [],
      },
    };
    const viewConcept = mount(<Router><ViewConcept {...newProps} /></Router>);
    expect(viewConcept.exists('#descriptions .text-none')).toBeTruthy();
  });

  it('should display the mappings if they are available', () => {
    const viewConcept = mount(<Router><ViewConcept {...props} /></Router>);
    expect(viewConcept.exists('#qaMappings')).toBeTruthy();
    expect(viewConcept.exists('#setMappings')).toBeTruthy();
    expect(viewConcept.exists('#otherMappings')).toBeTruthy();
  });

  it('should not display the mappings if they are not available', () => {
    const newProps = {
      ...props,
      qaMappings: [],
      setMappings: [],
      otherMappings: [],
    };
    const viewConcept = mount(<Router><ViewConcept {...newProps} /></Router>);
    expect(viewConcept.exists('#qaMappings')).toBeFalsy();
    expect(viewConcept.exists('#setMappings')).toBeFalsy();
    expect(viewConcept.exists('#otherMappings .text-none')).toBeTruthy();
  });
});
