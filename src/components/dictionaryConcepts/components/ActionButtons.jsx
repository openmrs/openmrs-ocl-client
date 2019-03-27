import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { CUSTOM_SOURCE } from './helperFunction';

const ActionButtons = ({
  actionButtons,
  source,
  id,
  concept_class,
  showDeleteModal,
  version_url,
  retired,
}) => {
  const dictionaryPathName = localStorage.getItem('dictionaryPathName');
  let showExtra;
  if (actionButtons === true) {
    showExtra = true;
  }
  return (
    !retired && <React.Fragment>
      {showExtra && (
        <React.Fragment>
          <Link
            className="edit-button-link btn btn-sm mb-1 actionButtons"
            to={`/edit/${concept_class}/${id}${dictionaryPathName}`}
          >
          Edit
          </Link>
        </React.Fragment>
      )}
      {source !== CUSTOM_SOURCE && (
        <button
          type="button"
          className="btn btn-sm mb-1 actionButtons action-btn-style"
          id="retireConcept"
          onClick={() => {
            showDeleteModal(version_url);
          }}
        >
          Remove
        </button>
      )}
    </React.Fragment>
  );
};

ActionButtons.propTypes = {
  actionButtons: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  concept_class: PropTypes.string.isRequired,
  showDeleteModal: PropTypes.func.isRequired,
  version_url: PropTypes.string.isRequired,
  handleDeleteMapping: PropTypes.func.isRequired,
  showDeleteMappingModal: PropTypes.func.isRequired,
  display_name: PropTypes.string.isRequired,
  mappings: PropTypes.array,
  source: PropTypes.string,
  mappingLimit: PropTypes.number,
  retired: PropTypes.bool,
};

ActionButtons.defaultProps = {
  source: '',
  mappings: [],
  mappingLimit: null,
  retired: false,
};

export default ActionButtons;
