import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RemoveMappingsModal from './RemoveMappingsModal';

class RemoveMappings extends Component {
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
    const { url, retired, handleDeleteMapping, showDeleteMappingModal } = this.props;
    return (
      <React.Fragment>
        { !retired && (
          <button
            type="button"
            className="btn btn-sm mb-1 actionButtons"
            onClick={() => {
              this.handleToggle();
              showDeleteMappingModal(url);
            }}
          >
          Remove
            <RemoveMappingsModal
              modal={modal}
              toggle={this.handleToggle}
              handleDeleteMapping={handleDeleteMapping}
              url={url}
            />
          </button>)
      }
      </React.Fragment>
    );
  }
}

RemoveMappings.propTypes = {
  handleDeleteMapping: PropTypes.func.isRequired,
  showDeleteMappingModal: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired,
  retired: PropTypes.bool,
};

RemoveMappings.defaultProps = {
  retired: false,
};

export default RemoveMappings;
