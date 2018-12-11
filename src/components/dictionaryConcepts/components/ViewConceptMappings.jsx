import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ViewMappingsModal from './ViewMappingsModal';

class ViewConceptMappings extends Component {
    state = {
      editModalIsOpen: false,
    };

  handleToggle = (toggleValue) => {
    this.setState({
      editModalIsOpen: toggleValue,
    });
  };

  render() {
    const { editModalIsOpen } = this.state;
    const {
      mappings, displayName, showDeleteMappingModal, handleDeleteMapping, source,
    } = this.props;
    return (
      <React.Fragment>
        <button
          type="button"
          className="btn btn-sm mb-1 actionButtons"
          onClick={() => this.handleToggle(true)}
        >
          View mappings
          <ViewMappingsModal
            mappings={mappings}
            displayName={displayName}
            source={source}
            handleDeleteMapping={handleDeleteMapping}
            showDeleteMappingModal={showDeleteMappingModal}
            modal={editModalIsOpen}
            handleToggle={this.handleToggle}
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
  source: PropTypes.string,
  mappings: PropTypes.array,
};

ViewConceptMappings.defaultProps = {
  source: '',
  mappings: [],
};

export default ViewConceptMappings;
