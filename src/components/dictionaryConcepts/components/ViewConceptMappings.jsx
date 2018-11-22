import React, { Component } from 'react';
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
    const { mappings, displayName } = this.props;
    return (
      <React.Fragment>
        <button
          type="button"
          className="btn btn-sm mb-1 actionButtons"
          onClick={this.handleToggle}
        >
          View mappings
          <ViewMappingsModal mappings={mappings} displayName={displayName} modal={modal} handleToggle={this.handleToggle} />
        </button>
      </React.Fragment>
    );
  }
}

export default ViewConceptMappings;
