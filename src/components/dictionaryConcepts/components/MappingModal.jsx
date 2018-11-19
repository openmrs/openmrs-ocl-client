import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';

import InternalMapping from './InternalMapping';
import ExternalMapping from './ExternalMapping';

class MappingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'Internal Mapping',
      map_type: '',
      concept_url: '',
      term: '',
      source_url: '',
      code: '',
    };
  }

  handleType = (event) => {
    const {
      target: { value, name },
    } = event;
    this.setState(() => ({
      [name]: value,
    }));
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      ...this.state,
      [name]: value,
    });
  };

  render() {
    const { handleToggle, modal } = this.props;
    const {
      type, map_type, concept_url, term, source_url, code,
    } = this.state;
    return (
      <div>
        <Modal isOpen={modal}>
          <ModalHeader>Map to reference terms</ModalHeader>
          <ModalBody>
            <select
              id="type"
              name="type"
              value={type}
              className="form-control"
              onChange={this.handleType}
              required
            >
              <option>Internal Mapping</option>
              <option>External Mapping</option>
            </select>
            {type === 'Internal Mapping' ? (
              <InternalMapping
                handleChange={this.handleChange}
                map_type={map_type}
                concept_url={concept_url}
              />
            ) : (
              <ExternalMapping
                handleChange={this.handleChange}
                map_type={map_type}
                term={term}
                source_url={source_url}
                code={code}
              />
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="primary">Save</Button>
            {' '}
            <Button color="secondary" onClick={handleToggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

MappingModal.propTypes = {
  modal: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
};

export default MappingModal;
