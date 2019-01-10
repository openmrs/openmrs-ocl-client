import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ViewConceptMappings from './ViewConceptMappings';

const ActionButtons = ({
  actionButtons,
  id,
  concept_class,
  showDeleteModal,
  version_url,
  mappings,
  source,
  mappingLimit,
  display_name,
  showDeleteMappingModal,
  handleDeleteMapping,
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
            className="edit-button-link btn btn-sm mb-1 actionButtons"
            to={`/edit/${concept_class}/${id}${dictionaryPathName}`}
          >
          Edit
          </Link>
          {
          mappings && (
          <ViewConceptMappings
            mappings={mappings}
            displayName={display_name}
            mappingLimit={mappingLimit}
            source={source}
            showDeleteMappingModal={showDeleteMappingModal}
            handleDeleteMapping={handleDeleteMapping}
          />

          )
        }
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
  handleDeleteMapping: PropTypes.func.isRequired,
  showDeleteMappingModal: PropTypes.func.isRequired,
  display_name: PropTypes.string.isRequired,
  mappings: PropTypes.array,
  source: PropTypes.string,
  mappingLimit: PropTypes.number,
};

ActionButtons.defaultProps = {
  source: '',
  mappings: [],
  mappingLimit: null,
};

export default ActionButtons;
