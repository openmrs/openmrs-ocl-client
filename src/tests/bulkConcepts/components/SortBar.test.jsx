import React from 'react';
import { mount } from 'enzyme';
import SortBar from '../../../components/bulkConcepts/component/SortBar';

describe('SortBar', () => {
  const setSortCriteria = jest.fn();
  const setSortDirection = jest.fn();
  let sortBar;

  beforeEach(() => {
    sortBar = mount(
      <SortBar
        setSortCriteria={setSortCriteria}
        setSortDirection={setSortDirection}
        sortCriteria="id"
        sortDirection="sortAsc"
      />,
    );

    setSortCriteria.mockClear();
    setSortDirection.mockClear();
  });

  afterEach(() => {
    sortBar.unmount();
  });

  it('should call setSortDirection when the sort direction changes', () => {
    expect(setSortDirection).not.toHaveBeenCalled();
    sortBar.find('select[name="sort-bar-direction"]').simulate('change', { target: { value: 'sortDesc' } });
    expect(setSortDirection).toHaveBeenCalledWith('sortDesc');
  });

  it('should call setSortCriteria when the sort direction changes', () => {
    expect(setSortCriteria).not.toHaveBeenCalled();
    sortBar.find('select[name="sort-bar-criteria"]').simulate('change', { target: { value: 'name' } });
    expect(setSortCriteria).toHaveBeenCalledWith('name');
  });
});
