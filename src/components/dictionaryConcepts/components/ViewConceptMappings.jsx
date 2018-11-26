import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ViewMappingsModal from './ViewMappingsModal';

class ViewConceptMappings extends Component {
    state = {
      modal: false,
    };

  handleToggle = () => {
    const { modal } = this.state;
    this.setState({
      modal: !modal,
    });
  };

  render() {
    const { modal } = this.state;
    const {
      mappings, displayName, showDeleteMappingModal, handleDeleteMapping, source,
    } = this.props;
    return (
      <React.Fragment>
        <button
          type="button"
          className="btn btn-sm mb-1 actionButtons"
          onClick={this.handleToggle}
        >
          View mappings
          <ViewMappingsModal
            mappings={mappings}
            displayName={displayName}
            source={source}
            modal={modal}
            handleDeleteMapping={handleDeleteMapping}
            handleToggle={this.handleToggle}
            showDeleteMappingModal={showDeleteMappingModal}
          />
        </button>
      </React.Fragment>
    );
  }
}

ViewConceptMappings.propTypes = {
  displayName: PropTypes.string.isRequired,
  handleDeleteMapping: PropTypes.func.isRequired,
  showDeleteMappingModal: PropTypes.func.isRequired,
};

export default ViewConceptMappings;
