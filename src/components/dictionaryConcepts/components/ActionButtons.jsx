import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import AddMapping from './AddMapping';

const ActionButtons = ({
  actionButtons, id, concept_class, showDeleteModal, version_url,
}) => {
  const dictionaryPathName = localStorage.getItem('dictionaryPathName');
  let showExtra;
  if (actionButtons === true) {
    showExtra = true;
  }

  return (
    <React.Fragment>
      {showExtra && (
        <React.Fragment>
          <Link
            className="btn btn-sm mb-1 actionButtons"
            to={`/edit/${concept_class}/${id}${dictionaryPathName}`}
          >
          Edit
          </Link>
          <AddMapping />
        </React.Fragment>
      )}
      <button
        type="button"
        className="btn btn-sm mb-1 actionButtons action-btn-style"
        id="retireConcept"
        onClick={() => { showDeleteModal(version_url); }}
      >
      Remove
      </button>
    </React.Fragment>
  );
};

ActionButtons.propTypes = {
  actionButtons: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  concept_class: PropTypes.string.isRequired,
  showDeleteModal: PropTypes.func.isRequired,
  version_url: PropTypes.string.isRequired,
};

export default ActionButtons;
