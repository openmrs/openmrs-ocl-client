import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const ActionButtons = ({
  actionButtons, id, concept_class,
}) => {
  const dictionaryPathName = localStorage.getItem('dictionaryPathName');

  if (actionButtons) {
    return (
      <React.Fragment>
        <Link
          to={`${dictionaryPathName}/edit/${id}/${concept_class}`}
        >
        Edit
        </Link>
        <a className="dummy-link">
        Delete
        </a>
      </React.Fragment>
    );
  }
  return <a className="dummy-link">Remove</a>;
};

ActionButtons.propTypes = {
  actionButtons: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  concept_class: PropTypes.string.isRequired,
};

export default ActionButtons;
