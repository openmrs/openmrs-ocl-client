import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';

import InternalMapping from './InternalMapping';
import ExternalMapping from './ExternalMapping';

export class MappingModal extends Component {
  constructor(props) {
    super(props);
    const { to_concept_url, map_type, url } = props;
    this.state = {
      type: 'Internal Mapping',
      to_concept_url,
      url,
      map_type,
      concept_url: '',
      term: '',
      source_url: to_concept_url,
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

  submitMapping = () => {
    const { to_concept_url, url, map_type } = this.state;
    const { source, editMapping } = this.props;
    editMapping(url, { to_concept_url, map_type }, source);
  }

  render() {
    const {
      handleToggle, modal, to_concept_url, to_concept_name, concepts,
    } = this.props;
    const {
      type, map_type, concept_url, term, code,
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
                to_concept_url={to_concept_url}
                to_concept_name={to_concept_name}
                concepts={concepts}
              />
            ) : (
              <ExternalMapping
                handleChange={this.handleChange}
                map_type={map_type}
                term={term}
                source_url={to_concept_url}
                code={code}
              />
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" id="mappingSubmit" onClick={this.submitMapping}>Save</Button>
            {' '}
            <Button color="secondary" onClick={handleToggle}>
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
  map_type: PropTypes.string,
  concepts: PropTypes.array,
  modal: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
  editMapping: PropTypes.func,
};

MappingModal.defaultProps = {
  to_concept_name: '',
  to_concept_url: '',
  source: '',
  url: '',
  map_type: '',
  concepts: [],
  editMapping: () => {},
};

export default MappingModal;
