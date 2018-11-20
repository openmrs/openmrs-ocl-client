import React from 'react';
import PropTypes from 'prop-types';
import SideNavItem from './SideNavItem';

const Sidenav = ({ filteredClass, filteredSources, handleChange }) => (
  <div className="col-12 col-md-2 custom-full-width">
    <div className="sidenav-container">
      <div className="row">
        <h6 className="sidenav-header">Sources</h6>
      </div>
      {filteredSources.map(source => (
        <SideNavItem item={source} key={source} filterType="source" handleChange={handleChange} />
      ))}
      <div className="row mt-3">
        <h6 className="sidenav-header">Class</h6>
      </div>
      {filteredClass.map(classItem => (
        <SideNavItem
          item={classItem}
          key={classItem}
          filterType="classes"
          handleChange={handleChange}
        />
      ))}
    </div>
  </div>
);

/* eslint-disable */
Sidenav.propTypes = {
  filteredSources: PropTypes.array.isRequired,
  filteredClass: PropTypes.array.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default Sidenav;
