import React from 'react';
import { shallow } from 'enzyme';
import Sidenav from '../../../components/bulkConcepts/component/Sidenav';
import { FILTER_TYPES } from '../../../constants';

let props;

describe('SideNav', () => {
  beforeEach(() => {
    props = {
      classList: ['Diagnosis'],
      datatypeList: ['Boolean'],
      handleChange: jest.fn(),
      toggleCheck: ['Diagnosis', 'CIEL'],
      clearAllBulkFilters: jest.fn(),
      datatypes: ['Boolean'],
      classes: ['Diagnosis'],
    };
  });

  it('should call clear all source filters when the clear source filters button is clicked', () => {
    const sidenav = shallow(<Sidenav {...props} />);
    sidenav.find('#clear-datatype-filters').simulate('click');
    expect(props.clearAllBulkFilters).toHaveBeenCalledWith(FILTER_TYPES.DATATYPE);
  });

  it('should call clear all class filters when the clear class filters button is clicked', () => {
    const sidenav = shallow(<Sidenav {...props} />);
    sidenav.find('#clear-class-filters').simulate('click');
    expect(props.clearAllBulkFilters).toHaveBeenCalledWith(FILTER_TYPES.CLASSES);
  });
});
