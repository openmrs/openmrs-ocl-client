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
    const { to_concept_name } = this.props;
    if (newProps.to_concept_name !== to_concept_name) {
      this.handleToggle();
    }
  }

  handleToggle = () => {
    const { modal } = this.state;
    this.setState({
      modal: !modal,
    });
  };

  render() {
    const { modal } = this.state;
    const {
      buttonName, to_concept_url, url, map_type, to_concept_name, source, editMapping, concepts,
    } = this.props;
    return (
      <React.Fragment>
        <button
          type="button"
          className="btn btn-sm mb-1 actionButtons"
          onClick={this.handleToggle}
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
  buttonName: PropTypes.string.isRequired,
  concepts: PropTypes.array,
  editMapping: PropTypes.func,
};

AddMapping.defaultProps = {
  to_concept_name: '',
  to_concept_url: '',
  source: '',
  url: '',
  map_type: '',
  concepts: [],
  editMapping: () => {},
};

export default AddMapping;
