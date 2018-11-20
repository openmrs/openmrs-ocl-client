import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { conceptsProps } from '../proptypes';
import ViewConceptMappings from './ViewConceptMappings';

const ActionButtons = ({
  actionButtons, showDeleteModal, handleShowMappingModal, concept,
}) => {
  const dictionaryPathName = localStorage.getItem('dictionaryPathName');
  let showExtra;
  if (actionButtons === true) {
    showExtra = true;
  }

  const { id, concept_class, version_url } = concept;

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
          <button
            type="button"
            onClick={() => handleShowMappingModal(concept)}
            className="btn btn-sm mb-1 actionButtons"
            id="mapConcept"
          >
            Add mapping
          </button>
          {
          concept.mappings && (
          <ViewConceptMappings
            mappings={concept.mappings}
            displayName={concept.display_name}
            mappingLimit={concept.mappingLimit}
          />

          )
        }
        </React.Fragment>
      )}
      <button
        type="button"
        className="btn btn-sm mb-1 actionButtons action-btn-style float-right"
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
  showDeleteModal: PropTypes.func.isRequired,
  concept: PropTypes.shape(conceptsProps).isRequired,
  handleShowMappingModal: PropTypes.func.isRequired,
};

export default ActionButtons;
