import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { CUSTOM_SOURCE, CONCEPT_CLASS } from './helperFunction';

const ActionButtons = ({
  actionButtons,
  source,
  id,
  concept_class,
  showDeleteModal,
  version_url,
  retired,
  retireConcept,
}) => {
  const dictionaryPathName = localStorage.getItem('dictionaryPathName');
  const showButton = source !== CUSTOM_SOURCE || concept_class === CONCEPT_CLASS;
  let showExtra;
  if (actionButtons === true) {
    showExtra = true;
  }
  return (
    <React.Fragment>
      {showButton && (
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
      {!retired && <React.Fragment>
        {showExtra && (
          <React.Fragment>
            <button
              className="btn btn-sm mb-1 actionButtons"
              type="button"
              id="retire"
              onClick={() => retireConcept(id, true)}
            >
              Retire
            </button>
            <Link
              className="edit-button-link btn btn-sm mb-1 actionButtons"
              to={`/edit/${concept_class}/${id}${dictionaryPathName}`}
            >
            Edit
            </Link>
          </React.Fragment>
        )}
      </React.Fragment>}
      {retired && showExtra && <button
        className="btn btn-sm mb-1 actionButtons"
        type="button"
        id="unRetire"
        onClick={() => retireConcept(id, false)}
      >
        Unretire
      </button>}
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
  retireConcept: PropTypes.func,
};

ActionButtons.defaultProps = {
  source: '',
  mappings: [],
  mappingLimit: null,
  retired: false,
  retireConcept: () => {},
};

export default ActionButtons;
