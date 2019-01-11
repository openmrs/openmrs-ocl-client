import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormGroup } from 'reactstrap';

class InternalMapping extends Component {
  handleChange = (event) => {
    this.props.handleChange(event);
  };

  render() {
    const {
      map_type, concept_url, to_concept_url, to_concept_name, concepts,
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
              To concept
              <select
                name="to_concept_url"
                defaultValue={concept_url}
                className="form-control"
                onChange={this.handleChange}
                required
              >
                {to_concept_name && <option value={to_concept_url}>{to_concept_name}</option>}
                {concepts.map(concept => (
                  <option key={concept.id} value={concept.url}>{concept.display_name}</option>
                ))}
              </select>
            </FormGroup>
          </div>
        </form>
      </div>
    );
  }
}

InternalMapping.propTypes = {
  map_type: PropTypes.string,
  concept_url: PropTypes.string,
  to_concept_url: PropTypes.string,
  to_concept_name: PropTypes.string,
  concepts: PropTypes.array,
  handleChange: PropTypes.func.isRequired,
};

InternalMapping.defaultProps = {
  to_concept_name: '',
  to_concept_url: '',
  concept_url: '',
  map_type: '',
  concepts: [],
};

export default InternalMapping;
