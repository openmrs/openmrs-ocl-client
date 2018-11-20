import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Input } from 'reactstrap';
import AsyncSelect from './AsyncSelect';
import { conceptsProps } from '../proptypes';

const ExternalMapping = (props) => {
  const {
    mapType, concept, handleChange, handleAsyncSelect, errors, toDictionaryUrl,
  } = props;
  const dictionarySearchUrl = `users/${concept.owner}/sources/`;
  const conceptSearchUrl = `${toDictionaryUrl}concepts/`;

  return (
    <Fragment>
      <FormGroup className="form-style">
        Mapping source concept
        <Input type="text" value={concept.display_name} readOnly />
      </FormGroup>
      <FormGroup className="form-style">
        Concept map type
        <b className="text-muted">&nbsp;*</b>
        <Input
          type="text"
          className="form-control answer"
          placeholder="Concept map type ex: Same"
          name="mapType"
          value={mapType}
          onChange={handleChange}
          autoComplete="off"
          id="mapType"
          required
        />
        <small className="form-text text-danger">{errors.mapType}</small>
      </FormGroup>
      <FormGroup className="form-style">
        Destination dictionary
        <AsyncSelect
          name="toDictionaryUrl"
          placeholder="Mapping destination dictionary ..."
          valueKey="url"
          labelKey="name"
          sourceUrl={dictionarySearchUrl}
          ignoreValue={dictionarySearchUrl}
          onChange={handleAsyncSelect}
        />
        <small className="form-text text-danger">{errors.toDictionaryUrl}</small>
      </FormGroup>
      <FormGroup className="form-style">
        Destination concept
        <AsyncSelect
          name="toConceptUrl"
          placeholder="Mapping destination concept ..."
          valueKey="id"
          labelKey="display_name"
          sourceUrl={conceptSearchUrl}
          ignoreValue={concept.source_url}
          onChange={handleAsyncSelect}
          disabled={!toDictionaryUrl && true}
        />
        <small className="form-text text-danger">{errors.toConceptUrl}</small>
      </FormGroup>
    </Fragment>
  );
};

ExternalMapping.propTypes = {
  mapType: PropTypes.string.isRequired,
  concept: PropTypes.shape(conceptsProps).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleAsyncSelect: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    mapType: PropTypes.string,
    toConceptUrl: PropTypes.string,
  }),
  toDictionaryUrl: PropTypes.string,
};

ExternalMapping.defaultProps = {
  errors: {},
  toDictionaryUrl: '',
};

export default ExternalMapping;
