import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';

import InternalMapping from './InternalMapping';
import ExternalMapping from './ExternalMapping';

const EXTERNAL_MAPPING = 'External Mapping';
const INTERNAL_MAPPING = 'Internal Mapping';

export class MappingModal extends Component {
  constructor(props) {
    super(props);
    const {
      to_concept_url, map_type, url, to_source_url, to_concept_name, to_concept_code,
    } = props;
    this.state = {
      type: to_concept_url === null ? EXTERNAL_MAPPING : INTERNAL_MAPPING,
      to_concept_url,
      url,
      map_type,
      to_source_url,
      to_concept_name,
      to_concept_code,
      concept_url: '',
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

  EditMapping = () => {
    const {
      to_concept_url, url, map_type, to_concept_code, to_source_url, to_concept_name, type,
    } = this.state;
    const { source, editMapping } = this.props;
    const payload = type !== INTERNAL_MAPPING ? {
      to_source_url, to_concept_name, to_concept_code, map_type,
    } : { to_concept_url, map_type };
    editMapping(url, payload, source);
  }

  render() {
    const {
      handleToggle, modal, to_concept_url, to_concept_name,
      concepts, to_concept_code, to_source_url,
    } = this.props;
    const {
      type, map_type, concept_url,
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
            {type === INTERNAL_MAPPING ? (
              <InternalMapping
                handleChange={this.handleChange}
                map_type={map_type}
                concept_url={concept_url}
                to_concept_url={to_concept_url}
                to_concept_name={to_concept_name}
                concepts={concepts}
              />
            ) : (
              <ExternalMapping
                handleChange={this.handleChange}
                map_type={map_type}
                to_concept_name={to_concept_name}
                to_source_url={to_source_url}
                to_concept_code={to_concept_code}
              />
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" id="mappingSubmit" onClick={to_concept_name !== '' ? this.EditMapping : null}>Save</Button>
            {' '}
            <Button color="secondary" id="CloseModal" onClick={() => handleToggle(false)}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

MappingModal.propTypes = {
  to_concept_name: PropTypes.string,
  to_concept_url: PropTypes.string,
  source: PropTypes.string,
  url: PropTypes.string,
  to_concept_code: PropTypes.string,
  map_type: PropTypes.string,
  to_source_url: PropTypes.string,
  concepts: PropTypes.array,
  modal: PropTypes.bool,
  handleToggle: PropTypes.func.isRequired,
  editMapping: PropTypes.func,
};

MappingModal.defaultProps = {
  to_concept_name: '',
  to_concept_url: '',
  source: '',
  url: '',
  map_type: '',
  to_source_url: '',
  to_concept_code: '',
  modal: false,
  concepts: [],
  editMapping: () => {},
};

export default MappingModal;
