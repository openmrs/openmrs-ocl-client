import React from 'react';
import PropTypes from 'prop-types';
import CreateConceptTable from './CreateConceptTable';
import DescriptionTable from './DescriptionTable';
import AnswersTable from './AnswersTable';
import CreateMapping from './CreateMapping';
import {
  classes,
  MAP_TYPE,
  CONCEPT_CLASS,
  isSetConcept,
  preventFormSubmit,
} from './helperFunction';

const CreateConceptForm = (props) => {
  const {
    concept,
    handleAsyncSelectChange,
    selectedAnswers,
    handleAnswerChange,
    addAnswerRow,
    removeAnswerRow,
    handleSetAsyncSelectChange,
    selectedSets,
    handleSetChange,
    removeSetRow,
    addSetRow,
    currentDictionaryName,
    mappings, addMappingRow,
    updateEventListener,
    updateSourceEventListener,
    isEditConcept,
    allSources,
    removeMappingRow,
    removeCurrentAnswer,
  } = props;

  const selectedMappings = mappings.filter(
    map => map.retired === false
        && map.map_type !== MAP_TYPE.questionAndAnswer
        && map.map_type !== MAP_TYPE.conceptSet,
  );
  const descriptions = props.existingConcept.descriptions || props.description;

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <form className="form-wrapper" onKeyPress={preventFormSubmit} onSubmit={props.handleSubmit} id="createConceptForm">
      <div className="concept-form-body">
        <div className="concept-info card">
          <legend id="concept-details-title" className="text-left section-header">Concept Details</legend>
          <div id="concept-details">
          <div className="form-row">
            <label htmlFor="external_id"><h5>OpenMRS UUID (OCL External ID)</h5></label>
            </div>
            <div className="form-row">
              <div className="form-group col-md-7">
            <input
              type="text"
              className="form-control"
              readOnly={props.editable}
              onChange={props.handleChange}
              name="external_id"
              value={props.state.external_id}
              id="uuid"
              required
            />
            <small className="form-text text-muted">
            Only alphanumeric characters, hyphens, periods, and underscores are allowed.
            </small>
          </div>
          {(!isEditConcept) && (
          <div className="form-group col-md-3 custom-field">
            <button
              type="submit"
              className="btn btn-light"
              id="toggleUUID"
              onClick={props.toggleUUID}
            >
                click here to manually enter
            </button>
          </div>
          )}
        </div>
        <div className="form-row">
          <div className="form-group col-md-7">
            <label htmlFor="id"><h5>OCL ID</h5></label>
            <input
              type="text"
              className="form-control"
              onChange={props.handleChange}
              value={props.state.id}
              readOnly={isEditConcept}
              name="id"
              id="id"
            />
            <small className="form-text text-muted">
              This ID is used when viewing your concept in OCL,
              but it will not be reflected when you download it to OpenMRS.
              This ID must be unique within your dictionary,
              and it cannot be changed after creating the concept.
            </small>
          </div>
        </div>
        <div className="form-row">
          {!props.concept && (
          <div className="form-group col-md-5">
            <label htmlFor="class"><h5>Class</h5></label>
            <select
              id="class"
              name="concept_class"
              value={props.state.concept_class}
              className="custom-select"
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
            <label htmlFor="class"><h5>Class</h5></label>
            <div>
              { (!isEditConcept) && (props.concept.toString().trim() === 'Symptom-Finding')
              && (
              <React.Fragment>
                <select
                  id="class"
                  name="concept_class"
                  value={props.state.concept_class}
                  className="custom-select symptom-finding"
                  required
                  onChange={props.handleChange}
                >
                  <option value="" key="default" />
                  <option key="Symptom/Finding">Symptom/Finding</option>
                  <option key="Symptom">Symptom</option>
                  <option key="Finding">Finding</option>

                </select>
              </React.Fragment>
              )
              }
              {(isEditConcept) && (
                <input
                  type="text"
                  className="form-control col-12 text-capitalize pt-3"
                  value={ props.state.concept_class}
                  readOnly={isEditConcept}
                  name="concept_class"
                  id="class"
                />
              )}

              { isSetConcept(props.concept.toString().trim())
              && (
              <React.Fragment>
                <select
                  id="class"
                  name="concept_class"
                  value={props.state.concept_class}
                  className="custom-select set"
                  required
                  onChange={props.handleChange}
                >
                  <option value="" key="default" />
                  <option value="LabSet" key="LabSet">LabSet</option>
                  <option value="ConvSet" key="ConvSet">ConvSet</option>
                  <option value="MedSet" key="MedSet">MedSet</option>

                </select>
              </React.Fragment>
              )
              }
              {(!isEditConcept) && (
                props.concept.toString().trim() !== 'Symptom-Finding'
                && props.concept.toString().trim() !== 'Set') && (
                <span className="btn btn-light normal-cursor col-12 text-capitalize pt-3">
                  {props.concept}
                </span>
              )}
            </div>
          </div>
          )}
        </div>
        <div className="datatypefield">
          <label htmlFor="datatype"><h5>Datatype</h5></label>
          <select
            id="datatype"
            name="datatype"
            required
            value={props.state.datatype}
            className="custom-select"
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
            <option>Coded</option>
          </select>
            </div>
          </div>
        </div>
        <div className="concept-table card">
          <div className="form-group">
            <fieldset className="row col-12 custom-concept-list">
              <legend className="text-left section-header">Names</legend>
              <CreateConceptTable {...props} />
              <button
                type="button"
                onClick={props.handleNewName}
                id="add-more-name"
                className="btn btn-outline-secondary btn-sm "
              >
                Add another name...
              </button>
            </fieldset>
          </div>
        </div>
        <div className="concept-table card">
          <div className="form-group">
            <fieldset className="row col-12 custom-concept-list">
              <legend className="text-left section-header">Descriptions</legend>
              <DescriptionTable {...props} />
              <button
                type="button"
                id="add-more-description"
                onClick={props.addDescription}
                className="btn btn-outline-secondary btn-sm "
              >
                {descriptions.length > 0 ? 'Add another description...' : 'Add a description'}
              </button>
            </fieldset>
          </div>
        </div>
        {(isSetConcept(props.concept.toString().trim()) || !concept || isEditConcept) && (
          <div className="form-group set card">
            <fieldset className="row col-12 custom-concept-list">
              <legend className="section-header">Set Members</legend>
              <AnswersTable
                handleAsyncSelectChange={handleSetAsyncSelectChange}
                selectedAnswers={selectedSets}
                handleAnswerChange={handleSetChange}
                removeAnswerRow={removeSetRow}
                currentDictionaryName={currentDictionaryName}
                isEditConcept={isEditConcept}
                mapType={MAP_TYPE.conceptSet}
                removeCurrentAnswer={removeCurrentAnswer}
              />
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm mt-3"
                onClick={addSetRow}
              >
                Add set...
              </button>
            </fieldset>
          </div>
        )}
        {(concept.toString().trim() === CONCEPT_CLASS.question || !concept || isEditConcept) && (
          <div className="form-group answer card">
            <fieldset className="row col-12 custom-concept-list">
              <legend className="section-header">Answers</legend>
              <AnswersTable
                handleAsyncSelectChange={handleAsyncSelectChange}
                selectedAnswers={selectedAnswers}
                handleAnswerChange={handleAnswerChange}
                removeAnswerRow={removeAnswerRow}
                currentDictionaryName={currentDictionaryName}
                isEditConcept={isEditConcept}
                mapType={MAP_TYPE.questionAndAnswer}
                removeCurrentAnswer={removeCurrentAnswer}
              />
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm mt-3"
                onClick={addAnswerRow}
              >
                Add answer...
              </button>
            </fieldset>
          </div>
        )}
        <div className="concept-table card">
          <div className="form-group">
            <fieldset className="row col-12 custom-concept-list">
              <legend className="section-header">Mappings</legend>
              <table className=" table-striped table-bordered concept-form-table">
                <thead className="concept-form-table-header">
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
                      sourceObject={mapping.sourceObject}
                      url={mapping.url}
                      map_type={mapping.map_type}
                      to_concept_code={mapping.to_concept_code}
                      to_concept_name={mapping.to_concept_name}
                      updateEventListener={updateEventListener}
                      updateSourceEventListener={updateSourceEventListener}
                      removeMappingRow={removeMappingRow}
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
            </fieldset>
          </div>
          <br />
        </div>
        <div className="submit-button text-right">
          <button className="btn btn-outline-primary mr-1" type="submit" disabled={props.disableButton}>
            {props.isEditConcept ? 'Update' : 'Create' }
          </button>
          <button id="remove" className="btn btn-outline-danger cancelButton" type="button" onClick={props.showModal}>
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
    external_id: PropTypes.string,
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
  handleSetAsyncSelectChange: PropTypes.func,
  selectedSets: PropTypes.array,
  handleSetChange: PropTypes.func,
  removeSetRow: PropTypes.func,
  addSetRow: PropTypes.func,
  mappings: PropTypes.array,
  addMappingRow: PropTypes.func,
  updateEventListener: PropTypes.func,
  updateSourceEventListener: PropTypes.func,
  showModal: PropTypes.func,
  removeMappingRow: PropTypes.func,
  allSources: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  addAnswerRow: PropTypes.func,
  removeAnswerRow: PropTypes.func,
  currentDictionaryName: PropTypes.string,
  removeCurrentAnswer: PropTypes.func,
  description: PropTypes.array,
};

CreateConceptForm.defaultProps = {
  path: '',
  existingConcept: {},
  isEditConcept: false,
  handleAsyncSelectChange: () => {},
  handleAnswerChange: () => {},
  showModal: () => {},
  selectedAnswers: [],
  handleSetAsyncSelectChange: () => {},
  handleSetChange: () => {},
  removeSetRow: () => {},
  selectedSets: [],
  addSetRow: () => {},
  mappings: [],
  addMappingRow: null,
  updateEventListener: null,
  updateSourceEventListener: null,
  removeMappingRow: null,
  addAnswerRow: () => {},
  removeAnswerRow: () => {},
  currentDictionaryName: '',
  removeCurrentAnswer: () => {},
  description: [],
};

export default CreateConceptForm;
