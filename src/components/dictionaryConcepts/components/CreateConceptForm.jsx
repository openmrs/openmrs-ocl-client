import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import CreateConceptTable from './CreateConceptTable';
import DescriptionTable from './DescriptionTable';
import { classes } from './helperFunction';

const CreateConceptForm = props => (
  <form className="form-wrapper" onSubmit={props.handleSubmit} id="createConceptForm">
    <div className="concept-form-body">
      <div className="form-row">
        <div className="form-group col-md-7">
          <label htmlFor="uuid">UUID</label>
          <input
            type="text"
            className="form-control"
            readOnly={props.editable}
            onChange={props.handleChange}
            value={props.state.id}
            name="id"
            id="uuid"
            required
          />
          <small className="form-text text-muted">
            Only alphanumeric characters, hyphens, periods, and underscores are allowed.
          </small>
        </div>
        <div className="form-group col-md-3 custom-field">
          <button className="btn btn-sm btn-light" id="toggleUUID" onClick={props.toggleUUID}>
            click here to manually enter
          </button>
        </div>
      </div>
      <div className="form-row">
        {!props.concept && (
          <div className="form-group col-md-5">
            <label htmlFor="class">Class</label>
            <select
              id="class"
              name="concept_class"
              value={props.state.concept_class}
              className="form-control"
              required
              onChange={props.handleChange}
            >
              <option value="N/A" />
              {classes.map(option => <option key={option}>{option}</option>)}
            </select>
          </div>
        )}
        {props.concept && (
          <div className="form-group col-md-5">
            <label htmlFor="class">Class</label>
            <div>
              { (props.concept.toString().trim() === 'symptom-finding') &&
              <React.Fragment>
                <select
                  id="class"
                  name="concept_class"
                  value={props.state.concept_class}
                  className="form-control"
                  required
                  onChange={props.handleChange}
                >
                  <option key="Symptom-Finding">Symptom-Finding</option>
                  <option key="Symptom">Symptom</option>
                  <option key="Finding">Finding</option>

                </select>
              </React.Fragment>
              }
              {(props.concept.toString().trim() !== 'symptom-finding') && (
              <span className="btn btn-sm btn-light normal-cursor col-12 text-capitalize pt-3">
                {props.concept}
              </span>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="datatypefield">
        <label htmlFor="datatype">Datatype</label>
        <select
          id="datatype"
          name="datatype"
          required
          value={props.state.datatype}
          className="form-control "
          onChange={props.handleChange}
        >
          <option>Numeric</option>
          <option>Text</option>
          <option selected>None</option>
          <option>Document</option>
          <option>Date</option>
          <option>Time</option>
          <option>Datetime</option>
          <option>Boolean</option>
          <option>Rule</option>
          <option>Structured-Numeric</option>
          <option>Complex</option>
          <option>Coded</option>
        </select>
      </div>
      <div className="form-group">
        <div className="row col-12 custom-concept-list">
          <h6 className="text-left section-header">Names</h6>
          <CreateConceptTable {...props} />
          <a href="#!" className="text-left add-more-names" id="add-more-name" onClick={props.handleNewName}>
            Add name/synonym in different language
          </a>
        </div>
      </div>
      <div className="form-group">
        <div className="row col-12 custom-concept-list">
          <h6 className="text-left section-header">Descriptions</h6>
          <DescriptionTable {...props} />
          <a href="#!" className="text-left add-more-names" id="add-more-description" onClick={props.addDescription}>
            Add description in a different language
          </a>
        </div>
      </div>
      <div className="submit-button text-left">
        <Link
          to={props.path}
          className="collection-name small-text"
        >
          <button className="btn btn-sm mr-1 col-2 btn-danger" type="reset">
          Cancel
          </button>
        </Link>
        <button className="btn btn-sm bg-blue col-2" type="submit">
          Create
        </button>
      </div>
    </div>
  </form>
);

CreateConceptForm.propTypes = {
  addDescription: PropTypes.func.isRequired,
  handleNewName: PropTypes.func.isRequired,
  state: PropTypes.shape({
    datatype: PropTypes.string,
    concept_class: PropTypes.string,
    id: PropTypes.string,
  }).isRequired,
  concept: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  toggleUUID: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  editable: PropTypes.bool.isRequired,
};
export default CreateConceptForm;
