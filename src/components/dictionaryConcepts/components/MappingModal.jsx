import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup,
} from 'reactstrap';

import InternalMapping from './InternalMapping';
import ExternalMapping from './ExternalMapping';
import { conceptsProps } from '../proptypes';

const initialState = {
  type: 'internalMapping',
  mapType: '',
  toConceptUrl: '',
  toDictionaryUrl: '',
  errors: {},
  saving: false,
};

class MappingModal extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  handleType = (event) => {
    const {
      target: { value, name },
    } = event;
    this.setState({
      ...initialState,
      [name]: value,
    });
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      ...this.state,
      [name]: value,
    });
  };

  handleAsyncSelect = (data) => {
    const { name, value } = data;
    this.setState({
      ...this.state,
      [name]: value,
    });
  };

  validate = (entries) => {
    const errorBag = {};
    entries.map((entry) => {
      if (this.state[entry].length <= 0) {
        errorBag[entry] = 'Required';
      } else {
        delete errorBag[entry];
      }
      return errorBag;
    });
    return errorBag;
  };

  saveConceptMapping = (e) => {
    e.preventDefault();
    const { concept, createConceptMapping } = this.props;
    const {
      mapType, toConceptUrl, type, toDictionaryUrl,
    } = this.state;
    const internalMappingEntries = ['toConceptUrl', 'mapType'];
    const entriesToValidate = type === 'internalMapping'
      ? internalMappingEntries
      : ['toDictionaryUrl', ...internalMappingEntries];
    const errors = this.validate(entriesToValidate);
    if (Object.keys(errors).length > 0) {
      return this.setState({ errors });
    }
    this.setState({ saving: true });
    const internalMappingData = {
      map_type: mapType,
      from_concept_url: concept.url,
      to_concept_url: toConceptUrl,
      source_url: concept.source_url,
    };
    let mappingData = {};
    if (type === 'internalMapping') {
      mappingData = internalMappingData;
    } else {
      delete internalMappingData.to_concept_url;
      mappingData = {
        ...internalMappingData,
        to_source_url: toDictionaryUrl,
        to_concept_code: toConceptUrl,
      };
    }
    return createConceptMapping(mappingData).then(() => this.hideModal(null, true));
  };

  hideModal = (e, saved = false) => {
    const { handleHideModal } = this.props;
    this.setState(initialState);
    return handleHideModal(saved);
  };

  render() {
    const { showModal, concept } = this.props;
    const {
      type, mapType, toDictionaryUrl, errors, saving,
    } = this.state;

    return (
      <div>
        <Modal isOpen={showModal} onClosed={this.hideModal}>
          <form onSubmit={this.saveConceptMapping}>
            <ModalHeader toggle={this.hideModal}>Map to reference terms</ModalHeader>
            <ModalBody>
              <FormGroup className="form-style">
                Concept mapping type
                <select
                  id="type"
                  name="type"
                  value={type}
                  className="form-control"
                  onChange={this.handleType}
                  required
                >
                  <option value="internalMapping">Internal Mapping</option>
                  <option value="externalMapping">External Mapping</option>
                </select>
              </FormGroup>
              {type === 'internalMapping' ? (
                <InternalMapping
                  handleChange={this.handleChange}
                  handleAsyncSelect={this.handleAsyncSelect}
                  mapType={mapType}
                  concept={concept}
                  errors={errors}
                />
              ) : (
                <ExternalMapping
                  handleChange={this.handleChange}
                  mapType={mapType}
                  toDictionaryUrl={toDictionaryUrl}
                  handleAsyncSelect={this.handleAsyncSelect}
                  concept={concept}
                  errors={errors}
                />
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                type="submit"
                onClick={this.saveConceptMapping}
                disabled={saving}
              >
                {saving ? 'Saving ...' : 'Save mapping'}
              </Button>
              {' '}
              <Button color="secondary" onClick={this.hideModal} disabled={saving}>
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </Modal>
      </div>
    );
  }
}

MappingModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  handleHideModal: PropTypes.func.isRequired,
  createConceptMapping: PropTypes.func.isRequired,
  concept: PropTypes.shape(conceptsProps).isRequired,
};

export default MappingModal;
