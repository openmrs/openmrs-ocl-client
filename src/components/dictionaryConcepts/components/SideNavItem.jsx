import React from 'react';
import PropTypes from 'prop-types';

const SideNavItem = ({ item }) => (
  <div className="custom-control custom-checkbox">
    <input type="checkbox" className="custom-control-input" id={item} />
    <label className="custom-control-label" htmlFor={item}>
      {item}
    </label>
  </div>
);

SideNavItem.propTypes = {
  item: PropTypes.string.isRequired,
};

export default SideNavItem;
