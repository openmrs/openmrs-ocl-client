import React from 'react';
import PropTypes from 'prop-types';

const AddConceptModal = props => (
  <div>
    <div className="modal fade concept-modal" id={`conceptPreview${props.id}`} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">{props.display_name} Preview</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <strong><h4>Concept name: {props.display_name}</h4></strong>
            <div id="concept-details">
              <strong>Class:</strong> {props.concept_class}<br />
              <strong>Source: </strong>{props.source}<br />
              <strong>Owner:</strong> {props.owner}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" className="btn btn-primary">Add</button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

AddConceptModal.propTypes = {
  id: PropTypes.string.isRequired,
  display_name: PropTypes.string.isRequired,
  concept_class: PropTypes.string.isRequired,
  source: PropTypes.string.isRequired,
  owner: PropTypes.string.isRequired,

};
export default AddConceptModal;
