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
      term,
      source_url,
      code,
    } = this.props;

    return (
      <div>
        <form>
          <div>
            <FormGroup className="form-style">
              Type
              <select
                name="map_type"
                value={map_type}
                className="form-control"
                onChange={this.handleChange}
                id="map_type"
                required
              >
                <option>Same as</option>
                <option>Narrower than</option>
              </select>
            </FormGroup>
          </div>
          <div>
            <FormGroup className="form-style">
              To concept
              <Input
                type="text"
                className="form-control answer"
                placeholder="eg. /orgs/Regenstrief/sources/loinc2/concepts/32700-7/"
                name="to_concept_url"
                defaultValue={source_url}
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
                name="code"
                value={code}
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
                name="term"
                value={term}
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
  term: PropTypes.string.isRequired,
  source_url: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default ExternalMapping;
