import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import SideNavItem from './SideNavItem';
import { FILTER_TYPES } from '../../../constants';

const Sidenav = ({
  filteredClass, filteredSources, handleChange, toggleCheck, clearAllFilters,
}) => (
  <div className="col-12 col-md-3 custom-full-width">
    <div className="sidenav-container">
      <div className="row">
        <h5 className="sidenav-header">
          Source
          {filteredSources.length > 0 ? (
            <Button id="clear-source-filters" onClick={() => clearAllFilters(FILTER_TYPES.SOURCES)} className="btn btn-sm btn-outline-secondary clear-filter-button">Clear all</Button>
          ) : ('')}
        </h5>
      </div>
      {filteredSources.map(source => (
        <SideNavItem
          item={source}
          key={source}
          filterType="source"
          handleChange={handleChange}
          checkValue={toggleCheck.includes(`${source}`)}
        />
      ))}
      <div className="row mt-3">
        <h5 className="sidenav-header">
          Class
          {filteredClass.length > 0 ? (
            <Button id="clear-class-filters" onClick={() => clearAllFilters(FILTER_TYPES.CLASSES)} className="btn btn-sm btn-outline-secondary clear-filter-button">Clear all</Button>
          ) : ('')}
        </h5>
      </div>
      {filteredClass.map(classItem => (
        <SideNavItem
          item={classItem}
          key={classItem}
          filterType="classes"
          handleChange={handleChange}
          checkValue={toggleCheck.includes(`${classItem}`)}
        />
      ))}
    </div>
  </div>
);

/* eslint-disable */
Sidenav.propTypes = {
  filteredSources: PropTypes.array.isRequired,
  toggleCheck: PropTypes.array.isRequired,
  filteredClass: PropTypes.array.isRequired,
  handleChange: PropTypes.func.isRequired,
  clearAllFilters: PropTypes.func,
};

Sidenav.defaultProps = {
  toggleCheck: [],
  clearAllFilters: () => {},
}

export default Sidenav;
