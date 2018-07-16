import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import addExistingConcept from '../../../../redux/actions/concepts/addExistingConcepts';

const AddConceptModal = (props) => {
  const handleAddConcept = () => {
    const expressions = [props.url];
    props.addExistingConcept({ data: { expressions } });
    localStorage.setItem('conceptName', props.display_name);
    document.getElementById(`closePreviewModal${props.id}`).click();
  };
  return (
    <div>
      <div className="modal fade concept-modal" id={`conceptPreview${props.id}`} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">{props.display_name} Preview / Details</h5>
              <button type="button" className="close" data-dismiss="modal" id={`closePreviewModal${props.id}`} aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div id="concept-details">
                <div className="card">
                  <div className="card-header">
                    <strong>Names and synonmys</strong>
                  </div>
                  <div className="card-body">
                    {props.display_name} {' '}
                    <span className="badge badge-secondary">{props.names}</span>{' '}
                    <span className="small text-muted"><em>[{props.locale}]</em></span>
                  </div>
                  <div className="card-header">
                    <strong>Descriptions</strong>
                  </div>
                  <div className="card-body">
                    {props.descriptions}{' '}
                    <span className="small text-muted"><em>[{props.locale}]</em></span>
                  </div>
                  <div className="card-header">
                    <strong>Mappings</strong>
                  </div>
                  <div className="card-body">
                    {props.mappings}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" id="modal-add-btn" onClick={() => handleAddConcept(props)}><i className="fa fa-plus">{' '}Add</i></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

AddConceptModal.propTypes = {
  addExistingConcept: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  display_name: PropTypes.string.isRequired,
  descriptions: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  names: PropTypes.string.isRequired,
  mappings: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};
export default connect(null, { addExistingConcept })(AddConceptModal);
