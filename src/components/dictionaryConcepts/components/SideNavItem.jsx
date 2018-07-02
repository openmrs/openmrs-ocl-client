import React from 'react';
import PropTypes from 'prop-types';

const SideNavItem = ({ item, handleChange, filterType }) => (
  <div className="custom-control custom-checkbox">
    <input
      type="checkbox"
      className="custom-control-input"
      filtertype={filterType}
      name={[item, filterType]}
      id={item}
      onChange={handleChange}
    />
    <label className="custom-control-label" htmlFor={item}>
      {item}
    </label>
  </div>
);

SideNavItem.propTypes = {
  item: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  filterType: PropTypes.string.isRequired,
};

export default SideNavItem;
