import React from 'react';
import PropTypes from 'prop-types';
import CreateConceptTable from './CreateConceptTable';
import DescriptionTable from './DescriptionTable';
import AnswersTable from './AnswersTable';
import CreateMapping from './CreateMapping';
import { classes, MAP_TYPE } from './helperFunction';

const CreateConceptForm = (props) => {
  const {
    concept, handleAsyncSelectChange,
    selectedAnswers,
    handleAnswerChange,
    addAnswerRow, removeAnswerRow, currentDictionaryName,
    mappings, addMappingRow, updateEventListener, removeMappingRow, updateAsyncSelectValue,
    isEditConcept, allSources,
  } = props;

  const selectedMappings = mappings
    .filter(map => map.retired === false && map.map_type !== MAP_TYPE.questionAndAnswer);

  return (
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
            <button
              type="submit"
              className="btn btn-sm btn-light"
              id="toggleUUID"
              onClick={props.toggleUUID}
            >
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
              { (props.concept.toString().trim() === 'symptom-finding')
              && (
              <React.Fragment>
                <select
                  id="class"
                  name="concept_class"
                  value={props.state.concept_class}
                  className="form-control symptom-finding"
                  required
                  onChange={props.handleChange}
                >
                  <option key="Symptom-Finding">Symptom-Finding</option>
                  <option key="Symptom">Symptom</option>
                  <option key="Finding">Finding</option>

                </select>
              </React.Fragment>
              )
              }

              { (props.concept.toString().trim() === 'set')
              && (
              <React.Fragment>
                <select
                  id="class"
                  name="concept_class"
                  value={props.state.concept_class}
                  className="form-control set"
                  required
                  onChange={props.handleChange}
                >
                  <option key="LabSet">LabSet</option>
                  <option key="ConvSet">ConvSet</option>
                  <option key="MedSet">MedSet</option>

                </select>
              </React.Fragment>
              )
              }

              {(
                props.concept.toString().trim() !== 'symptom-finding'
                && props.concept.toString().trim() !== 'set') && (
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
            <option>None</option>
            <option>Document</option>
            <option>Date</option>
            <option>Time</option>
            <option>Datetime</option>
            <option>Boolean</option>
            <option>Rule</option>
            <option>Structured-Numeric</option>
            <option>Complex</option>
            <option>to_concept_coded</option>
          </select>
        </div>
        <div className="concept-table ">
          <div className="form-group">
            <div className="row col-12 custom-concept-list">
              <h6 className="text-left section-header">Names</h6>
              <CreateConceptTable {...props} />
              <button
                type="button"
                onClick={props.handleNewName}
                id="add-more-name"
                className="btn btn-outline-secondary btn-sm "
              >
                Add another name...
              </button>
            </div>
          </div>
        </div>
        <div className="concept-table ">
          <div className="form-group">
            <div className="row col-12 custom-concept-list">
              <h6 className="text-left section-header">Descriptions</h6>
              <DescriptionTable {...props} />
              <button
                type="button"
                id="add-more-description"
                onClick={props.addDescription}
                className="btn btn-outline-secondary btn-sm "
              >
                Add another description...
              </button>
            </div>
          </div>
        </div>
        {concept.toString().trim() === 'question' ? (
          <div className="form-group answer">
            <div className="row col-12 custom-concept-list">
              <h6 className="text-left section-header">Answers</h6>
              <AnswersTable
                handleAsyncSelectChange={handleAsyncSelectChange}
                selectedAnswers={selectedAnswers}
                handleAnswerChange={handleAnswerChange}
                removeAnswerRow={removeAnswerRow}
                currentDictionaryName={currentDictionaryName}
                isEditConcept={isEditConcept}
              />
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm mt-3"
                onClick={addAnswerRow}
              >
                Add answer...
              </button>
            </div>
          </div>
        ) : null }
        <div className="concept-table ">
          <div className="form-group">
            <div className="row col-12 custom-concept-list">
              <h6 className="text-left section-header">Mappings</h6>
              <table className=" table-striped table-bordered concept-form-table">
                <thead className="header text-white">
                  <tr>
                    <th>Source</th>
                    <th>Relationship</th>
                    <th>Concept</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedMappings.map((mapping, i) => (
                    <CreateMapping
                      source={mapping.source}
                      url={mapping.url}
                      map_type={mapping.map_type}
                      to_concept_code={mapping.to_concept_code}
                      to_concept_name={mapping.to_concept_name}
                      updateEventListener={updateEventListener}
                      removeMappingRow={removeMappingRow}
                      updateAsyncSelectValue={updateAsyncSelectValue}
                      key={mapping.id}
                      index={i}
                      isEditConcept={isEditConcept}
                      isNew={mapping.isNew}
                      allSources={allSources}
                      isShown={false}
                    />
                  ))}
                </tbody>
              </table>
              <button
                type="button"
                onClick={addMappingRow}
                className="btn btn-outline-secondary btn-sm mt-3"
              >
                  Add another Mapping...
              </button>
            </div>
          </div>
          <br />
        </div>
        <div className="submit-button text-left">
          <button className="btn btn-primary mr-1" type="submit" disabled={props.disableButton}>
            {props.isEditConcept ? 'Update' : 'Create' }
          </button>
          <button id="remove" className="btn btn-danger" type="button" onClick={props.showModal}>
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};

CreateConceptForm.propTypes = {
  addDescription: PropTypes.func.isRequired,
  handleNewName: PropTypes.func.isRequired,
  handleAnswerChange: PropTypes.func,
  state: PropTypes.shape({
    datatype: PropTypes.string,
    concept_class: PropTypes.string,
    id: PropTypes.string,
  }).isRequired,
  concept: PropTypes.string.isRequired,
  path: PropTypes.string,
  toggleUUID: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  disableButton: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  editable: PropTypes.bool.isRequired,
  isEditConcept: PropTypes.bool,
  existingConcept: PropTypes.object,
  handleAsyncSelectChange: PropTypes.func,
  selectedAnswers: PropTypes.array,
  mappings: PropTypes.array,
  addMappingRow: PropTypes.func,
  updateEventListener: PropTypes.func,
  showModal: PropTypes.func,
  removeMappingRow: PropTypes.func,
  updateAsyncSelectValue: PropTypes.func,
  allSources: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  addAnswerRow: PropTypes.func,
  removeAnswerRow: PropTypes.func,
  currentDictionaryName: PropTypes.string,
};

CreateConceptForm.defaultProps = {
  path: '',
  existingConcept: {},
  isEditConcept: false,
  handleAsyncSelectChange: () => {},
  handleAnswerChange: () => {},
  showModal: () => {},
  selectedAnswers: [],
  mappings: [],
  addMappingRow: null,
  updateEventListener: null,
  removeMappingRow: null,
  updateAsyncSelectValue: null,
  addAnswerRow: () => {},
  removeAnswerRow: () => {},
  currentDictionaryName: '',
};

export default CreateConceptForm;
