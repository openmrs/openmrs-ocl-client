import React from 'react';
import { shallow } from 'enzyme';
import Sidenav from '../../../components/dictionaryConcepts/components/Sidenav';
import { FILTER_TYPES } from '../../../constants';

let props;

describe('SideNav', () => {
  beforeEach(() => {
    props = {
      filteredClass: ['Diagnosis'],
      filteredSources: ['CIEL'],
      handleChange: jest.fn(),
      toggleCheck: ['Diagnosis', 'CIEL'],
      clearAllFilters: jest.fn(),
    };
  });

  it('should call clear all source filters when the clear source filters button is clicked', () => {
    const sidenav = shallow(<Sidenav {...props} />);
    sidenav.find('#clear-source-filters').simulate('click');
    expect(props.clearAllFilters).toHaveBeenCalledWith(FILTER_TYPES.SOURCES);
  });

  it('should call clear all class filters when the clear class filters button is clicked', () => {
    const sidenav = shallow(<Sidenav {...props} />);
    sidenav.find('#clear-class-filters').simulate('click');
    expect(props.clearAllFilters).toHaveBeenCalledWith(FILTER_TYPES.CLASSES);
  });
});
