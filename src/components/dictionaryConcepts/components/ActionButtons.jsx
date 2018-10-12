import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const ActionButtons = ({
  actionButtons, id, concept_class, showDeleteModal, version_url,
}) => {
  const dictionaryPathName = localStorage.getItem('dictionaryPathName');

  return (
    <React.Fragment>
      {actionButtons === true &&
      <Link
        className="btn btn-sm mb-1 actionButtons"
        to={`/edit/${concept_class}/${id}${dictionaryPathName}`}
      >
      Edit
      </Link>
      }
      <button
        type="button"
        className="btn btn-sm mb-1 actionButtons"
        id="retireConcept"
        data-toggle="modal"
        data-target="#removeConceptModal"
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
