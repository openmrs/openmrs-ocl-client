import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter as Router } from 'react-router';
import ViewMapping from '../../../components/dictionaryConcepts/components/ViewMapping';

const props = {
  toSourceName: 'test_source_name',
  mapType: 'Same as',
  toConceptCode: '123',
  toConceptName: 'test_name',
  toConceptUrl: '/test/url/',
  showMappingType: true,
};

describe('ViewMapping', () => {
  it('should display the source name, concept code and name and actions', () => {
    const viewMapping = mount(<Router><ViewMapping {...props} /></Router>);
    const numberOfItemsDisplayed = viewMapping.find('td').length;
    const row = viewMapping.find('tr');

    expect(numberOfItemsDisplayed).toEqual(4);
    expect(row.childAt(0).text()).toEqual(props.toSourceName);
    expect(row.childAt(1).text()).toEqual(props.mapType);
    expect(row.childAt(2).text()).toEqual(
      `ID(${props.toConceptCode})- ${props.toConceptName}`,
    );
    expect(row.exists('td Link')).toBeTruthy();
  });

  it('should not display the mapping type if showMappingType is false', () => {
    const newProps = { ...props, showMappingType: false };
    const viewMapping = mount(<Router><ViewMapping {...newProps} /></Router>);
    const numberOfItemsDisplayed = viewMapping.find('td').length;
    const row = viewMapping.find('tr');

    expect(numberOfItemsDisplayed).toEqual(3);
    expect(row.childAt(0).text()).toEqual(props.toSourceName);
    expect(row.childAt(1).text()).toEqual(
      `ID(${props.toConceptCode})- ${props.toConceptName}`,
    );
    expect(row.exists('td Link')).toBeTruthy();
  });

  it('should not display the view concept action if the toConceptUrl is null', () => {
    const newProps = { ...props, toConceptUrl: null };
    const viewMapping = mount(<Router><ViewMapping {...newProps} /></Router>);
    const numberOfItemsDisplayed = viewMapping.find('td').length;
    const row = viewMapping.find('tr');

    expect(numberOfItemsDisplayed).toEqual(4);
    expect(row.childAt(0).text()).toEqual(props.toSourceName);
    expect(row.childAt(1).text()).toEqual(props.mapType);
    expect(row.childAt(2).text()).toEqual(
      `ID(${props.toConceptCode})- ${props.toConceptName}`,
    );
    expect(row.exists('td Link')).toBeFalsy();
  });

  it('should not display the concept name if it is null', () => {
    const newProps = { ...props, toConceptName: null };
    const viewMapping = mount(<Router><ViewMapping {...newProps} /></Router>);
    const numberOfItemsDisplayed = viewMapping.find('td').length;
    const row = viewMapping.find('tr');

    expect(numberOfItemsDisplayed).toEqual(4);
    expect(row.childAt(0).text()).toEqual(props.toSourceName);
    expect(row.childAt(1).text()).toEqual(props.mapType);
    expect(row.childAt(2).text()).toEqual(`ID(${props.toConceptCode})`);
    expect(row.exists('td Link')).toBeTruthy();
  });
});
