import React from 'react';
import PropTypes from 'prop-types';

const SideNavItems = ({
  listItem, handleChange, value, filterType,
}) => (
  <div className="custom-control custom-checkbox">
    <input
      type="checkbox"
      className="custom-control-input"
      name={[listItem, filterType]}
      id={listItem}
      data-own="stuff"
      value={value}
      onChange={handleChange}
    />
    <label className="custom-control-label bulk-concept-label" htmlFor={listItem}>
      {listItem}
    </label>
  </div>
);

SideNavItems.propTypes = {
  listItem: PropTypes.string.isRequired,
  filterType: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default SideNavItems;
