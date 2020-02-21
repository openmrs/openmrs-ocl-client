import React from 'react';
import PropTypes from 'prop-types';
import { convertToFrontendNameType } from './helperFunction';
import { findLocale } from '../../dashboard/components/dictionary/common/Languages';
import ViewMapping from './ViewMapping';

const ViewConcept = (props) => {
  const {
    concept: {
      descriptions,
      id,
      concept_class,
      datatype,
      names,
      external_id,
      uuid,
    },
    qaMappings,
    setMappings,
    otherMappings,
    numericPrecisionOptions,
  } = props;

  return (
    <div id="view-concept-form" className="concept-form concept-form-wrapper text-left">
      <div className="concept-form-body">
        <div className="concept-info card">
          <legend id="concept-details-title" className="section-header">
            Concept Details
          </legend>
          <div id="concept-details">
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="id"><u>OCL ID</u></label>
                <div id="id">{id}</div>
              </div>
              <div className="col-md-4">
                <label htmlFor="version-id"><u>Version ID</u></label>
                <div id="version-id">{uuid}</div>
              </div>
              <div className="col-md-4">
                <label htmlFor="external-id"><u>OpenMRS UUID (OCL External ID)</u></label>
                <div id="external-id">{external_id}</div>
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="class"><u>Class</u></label>
                <div id="class">{concept_class}</div>
              </div>
              <div className="col-md-4">
                <label htmlFor="datatype"><u>Datatype</u></label>
                <div id="datatype">{datatype}</div>
              </div>
              {datatype === 'Numeric' &&
              <div className="col-md-4">
              <label htmlFor="numericPrecision"><u>Numeric Precision</u></label>
              <div id="numericPrecision">{numericPrecisionOptions}</div>
            </div>
              }  
            </div>
          </div>
        </div>
        <div className="concept-table card">
          <div className="form-group">
            <fieldset className="row col-12 custom-concept-list">
              <legend className="section-header">Names</legend>
              <table className="table-striped table-bordered concept-form-table">
                <thead className="concept-form-table-header">
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Language</th>
                  </tr>
                </thead>
                <tbody>
                  {names.map(name => (
                    <tr>
                      <td>{name.name}</td>
                      <td>{convertToFrontendNameType(name.name_type)}</td>
                      <td>{findLocale(name.locale).label}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </fieldset>
          </div>
        </div>
        <div id="descriptions" className="concept-table card">
          <div className="form-group">
            <fieldset className="row col-12 custom-concept-list">
              <legend className="text-left section-header">Descriptions</legend>
              {descriptions && descriptions.length > 0 ? (
                <table className="table-striped table-bordered concept-form-table">
                  <thead className="concept-form-table-header">
                    <tr>
                      <th>Description</th>
                      <th>Language</th>
                    </tr>
                  </thead>
                  <tbody>
                    {descriptions.map(description => (
                      <tr>
                        <td>{description.description}</td>
                        <td>{findLocale(description.locale).label}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (<span className="text-none">None</span>)}
            </fieldset>
          </div>
        </div>
        {qaMappings && qaMappings.length > 0 ? (
          <div id="qaMappings" className="concept-table card">
            <div className="form-group">
              <fieldset className="row col-12 custom-concept-list">
                <legend className="section-header">Answers</legend>
                <table className=" table-striped table-bordered concept-form-table">
                  <thead className="concept-form-table-header">
                    <tr>
                      <th>Source</th>
                      <th>Concept</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {qaMappings.map(mapping => (
                      <ViewMapping
                        toSourceName={mapping.to_source_name}
                        mapType={mapping.map_type}
                        toConceptCode={mapping.to_concept_code}
                        toConceptName={mapping.to_concept_name}
                        toConceptUrl={mapping.to_concept_url}
                        showMappingType={false}
                      />
                    ))}
                  </tbody>
                </table>
              </fieldset>
            </div>
            <br />
          </div>
        ) : ''}
        {setMappings && setMappings.length > 0 ? (
          <div id="setMappings" className="concept-table card">
            <div className="form-group">
              <fieldset className="row col-12 custom-concept-list">
                <legend className="section-header">Set Members</legend>
                <table className=" table-striped table-bordered concept-form-table">
                  <thead className="concept-form-table-header">
                    <tr>
                      <th>Source</th>
                      <th>Concept</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {setMappings.map(mapping => (
                      <ViewMapping
                        toSourceName={mapping.to_source_name}
                        mapType={mapping.map_type}
                        toConceptCode={mapping.to_concept_code}
                        toConceptName={mapping.to_concept_name}
                        toConceptUrl={mapping.to_concept_url}
                        showMappingType={false}
                      />
                    ))}
                  </tbody>
                </table>
              </fieldset>
            </div>
            <br />
          </div>
        ) : ''}
        <div id="otherMappings" className="concept-table card">
          <div className="form-group">
            <fieldset className="row col-12 custom-concept-list">
              <legend className="section-header">Mappings</legend>
              {otherMappings && otherMappings.length > 0 ? (
                <table className=" table-striped table-bordered concept-form-table">
                  <thead className="concept-form-table-header">
                    <tr>
                      <th>Source</th>
                      <th>Relationship</th>
                      <th>Concept</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {otherMappings.map(mapping => (
                      <ViewMapping
                        toSourceName={mapping.to_source_name}
                        mapType={mapping.map_type}
                        toConceptCode={mapping.to_concept_code}
                        toConceptName={mapping.to_concept_name}
                        toConceptUrl={mapping.to_concept_url}
                        showMappingType
                      />
                    ))}
                  </tbody>
                </table>
              ) : (<span className="text-none">None</span>)}
            </fieldset>
          </div>
          <br />
        </div>
      </div>
    </div>
  );
};

ViewConcept.propTypes = {
  concept: PropTypes.shape({
    display_name: PropTypes.string,
    descriptions: PropTypes.array,
    mappings: PropTypes.any,
    display_locale: PropTypes.string,
    concept_class: PropTypes.string,
    datatype: PropTypes.string,
    url: PropTypes.string,
    external_id: PropTypes.string,
  }).isRequired,
  qaMappings: PropTypes.array.isRequired,
  setMappings: PropTypes.array.isRequired,
  otherMappings: PropTypes.array.isRequired,
};

export default ViewConcept;
