import React from 'react';
import PropTypes from 'prop-types';
import SideNavItem from './SideNavItem';

const Sidenav = ({ filteredClass, filteredSources }) => (
  <div className="col-12 col-md-2">
    <div className="sidenav-container">
      <div className="row">
        <h6 className="sidenav-header">Sources</h6>
      </div>
      {filteredSources.map(source => <SideNavItem item={source} />)}
      <div className="row mt-3">
        <h6 className="sidenav-header">Class</h6>
      </div>
      {filteredClass.map(classItem => <SideNavItem item={classItem} />)}
    </div>
  </div>
);

Sidenav.propTypes = {
  filteredSources: PropTypes.arrayOf(PropTypes.shape({
    Classes: PropTypes.string,
  })).isRequired,
  filteredClass: PropTypes.arrayOf(PropTypes.shape({
    Diagnosis: PropTypes.string,
  })).isRequired,
};

export default Sidenav;
