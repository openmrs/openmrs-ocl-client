import React from 'react';
import PropTypes from 'prop-types';

const ActionButtons = ({ actionButtons }) => {
  if (actionButtons) {
    return (
      <React.Fragment>
        <a className="dummy-link">Edit</a> <a className="dummy-link">Delete</a>
      </React.Fragment>
    );
  }
  return <a className="dummy-link">Remove</a>;
};

ActionButtons.propTypes = {
  actionButtons: PropTypes.bool.isRequired,
};

export default ActionButtons;
