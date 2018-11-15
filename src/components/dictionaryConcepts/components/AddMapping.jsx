import React, { Component } from 'react';
import MappingModal from './MappingModal';

class AddMapping extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
    };
  }

  handleToggle = () => {
    const { modal } = this.state;
    this.setState({
      modal: !modal,
    });
  };

  render() {
    const { modal } = this.state;
    return (
      <React.Fragment>
        <button
          type="button"
          className="btn btn-sm mb-1 actionButtons"
          onClick={this.handleToggle}
        >
          Add mapping
          <MappingModal modal={modal} handleToggle={this.handleToggle} />
        </button>
      </React.Fragment>
    );
  }
}

export default AddMapping;
