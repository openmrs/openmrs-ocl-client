import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Input } from 'reactstrap';

class ExternalMapping extends Component {
  handleChange = (event) => {
    this.props.handleChange(event);
  };

  render() {
    const {
      map_type,
      to_concept_name,
      to_source_url,
      to_concept_code,
    } = this.props;

    return (
      <div>
        <form>
          <div>
            <FormGroup className="form-style">
              Type
              <select
                name="map_type"
                defaultValue={map_type}
                className="form-control"
                onChange={this.handleChange}
                id="map_type"
                required
              >
                {map_type && <option>{map_type}</option>}
                <option>Same as</option>
                <option>Narrower than</option>
              </select>
            </FormGroup>
          </div>
          <div>
            <FormGroup className="form-style">
              To source
              <Input
                type="text"
                className="form-control answer"
                placeholder="eg. /orgs/Regenstrief/sources/loinc2/concepts/32700-7/"
                name="to_source_url"
                defaultValue={to_source_url}
                onChange={this.handleChange}
                required
              />
            </FormGroup>
          </div>
          <div>
            <FormGroup className="form-style">
              Code
              <Input
                type="text"
                className="form-control answer"
                placeholder="eg. jgug-fgtgtg-rfrg"
                name="to_concept_code"
                defaultValue={to_concept_code}
                onChange={this.handleChange}
                required
              />
            </FormGroup>
          </div>
          <div>
            <FormGroup className="form-style">
              Term
              <Input
                type="text"
                className="form-control answer"
                placeholder="eg. Malaria"
                name="to_concept_name"
                defaultValue={to_concept_name}
                onChange={this.handleChange}
                required
              />
            </FormGroup>
          </div>
        </form>
      </div>
    );
  }
}

ExternalMapping.propTypes = {
  map_type: PropTypes.string.isRequired,
  to_concept_name: PropTypes.string.isRequired,
  to_source_url: PropTypes.string.isRequired,
  to_concept_code: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default ExternalMapping;
