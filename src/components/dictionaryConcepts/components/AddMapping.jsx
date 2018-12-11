import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MappingModal from './MappingModal';

class AddMapping extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
    };
  }

  componentWillReceiveProps(newProps) {
    const { mappings } = this.props;
    if (newProps.mappings !== mappings) {
      this.handleToggle();
    }
  }

  handleToggle = (value) => {
    this.setState({
      modal: value,
    });
  };

  render() {
    const { modal } = this.state;
    const {
      buttonName, to_concept_url, url, map_type, to_concept_name,
      source, editMapping, concepts, to_concept_code, to_source_url,
    } = this.props;
    return (
      <React.Fragment>
        <button
          type="button"
          className="btn btn-sm mb-1 actionButtons"
          onClick={() => this.handleToggle(true)}
        >
          {buttonName}
          <MappingModal
            modal={modal}
            handleToggle={this.handleToggle}
            to_concept_url={to_concept_url}
            url={url}
            map_type={map_type}
            to_concept_name={to_concept_name}
            source={source}
            editMapping={editMapping}
            concepts={concepts}
            to_concept_code={to_concept_code}
            to_source_url={to_source_url}
          />
        </button>
      </React.Fragment>
    );
  }
}

AddMapping.propTypes = {
  to_concept_name: PropTypes.string,
  to_concept_url: PropTypes.string,
  source: PropTypes.string,
  url: PropTypes.string,
  map_type: PropTypes.string,
  to_concept_code: PropTypes.string,
  to_source_url: PropTypes.string,
  buttonName: PropTypes.string.isRequired,
  concepts: PropTypes.array,
  editMapping: PropTypes.func,
  mappings: PropTypes.array,
};

AddMapping.defaultProps = {
  to_concept_name: '',
  to_concept_url: '',
  source: '',
  url: '',
  map_type: '',
  to_concept_code: '',
  to_source_url: '',
  concepts: [],
  mappings: [],
  editMapping: () => {},
};

export default AddMapping;
