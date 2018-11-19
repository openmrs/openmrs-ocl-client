import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormGroup } from 'reactstrap';

class InternalMapping extends Component {
  handleChange = (event) => {
    this.props.handleChange(event);
  };

  render() {
    const { map_type, concept_url } = this.props;
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
              Concept
              <select
                name="concept_url"
                value={concept_url}
                className="form-control"
                onChange={this.handleChange}
                required
              >
                <option>Lobratus</option>
                <option>Potus</option>
              </select>
            </FormGroup>
          </div>
        </form>
      </div>
    );
  }
}

InternalMapping.propTypes = {
  map_type: PropTypes.string.isRequired,
  concept_url: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default InternalMapping;
