import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Input } from 'reactstrap';
import AsyncSelect from './AsyncSelect';
import { conceptsProps } from '../proptypes';

const InternalMapping = (props) => {
  const {
    mapType, concept, handleChange, handleAsyncSelect, errors,
  } = props;
  const conceptSearchUrl = `${concept.source_url}concepts/`;

  return (
    <Fragment>
      <FormGroup className="form-style">
        Concept source concept
        <Input type="text" value={concept.display_name} readOnly />
      </FormGroup>
      <FormGroup className="form-style">
        Concept map type
        <b className="text-muted">&nbsp;*</b>
        <Input
          name="mapType"
          value={mapType}
          onChange={handleChange}
          id="mapType"
          placeholder="Concept map type ... ex: Same"
          autoComplete="off"
          required
        />
        <small className="form-text text-danger">{errors.mapType}</small>
      </FormGroup>
      <FormGroup className="form-style">
        Map to
        <b className="text-muted">&nbsp;*</b>
        <AsyncSelect
          name="toConceptUrl"
          placeholder="Concept to map to(Concept within simular dictionary)..."
          valueKey="url"
          labelKey="display_name"
          sourceUrl={conceptSearchUrl}
          ignoreValue={concept.url}
          onChange={handleAsyncSelect}
        />
        <small className="form-text text-danger">{errors.toConceptUrl}</small>
      </FormGroup>
    </Fragment>
  );
};

InternalMapping.propTypes = {
  mapType: PropTypes.string.isRequired,
  concept: PropTypes.shape(conceptsProps).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleAsyncSelect: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    mapType: PropTypes.string,
    toConceptUrl: PropTypes.string,
  }),
};

InternalMapping.defaultProps = {
  errors: {},
};

export default InternalMapping;
