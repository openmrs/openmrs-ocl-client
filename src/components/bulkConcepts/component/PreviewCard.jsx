import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Modal, ModalBody, ModalFooter,
} from 'reactstrap';
import CardBody from './CardBody';
import MappingPreview from './MappingPreview';

const PreviewCard = ({
  open, concept, closeModal, addConcept,
}) => {
  const {
    display_name,
    descriptions,
    mappings,
    display_locale,
    id,
    url,
    version,
    created_on,
    concept_class,
    datatype,
    names,
  } = concept;

  const DATE_OPTIONS = {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };

  const mapping = mappings || 'none';
  const description = descriptions ? descriptions[0].description : 'none';
  const synonyms = names && names.map(name => name.name).join();
  return (
    <div className="col-9">
      <Modal isOpen={open} className="modal-lg">
        <ModalBody className="preview-modal">
          <h6>
            {id}
            <div className="card-version">
              <small>
                <em>
                  Version:&nbsp;
                  {version}
                </em>
                <em>
                  Created on:&nbsp;
                  {new Date(created_on).toLocaleDateString('en-US', DATE_OPTIONS)}
                </em>
              </small>
            </div>
          </h6>
          <div className="header-divider" />
          <p className="synonyms">
            Name
            {''}
            <small>
              <em className="float-right">{display_locale}</em>
            </small>
          </p>
          <div className="pop-up-description rounded">{display_name}</div>
          <CardBody title="Synonyms" body={synonyms} />
          <CardBody title="Description" body={description} />
          <div className="row preview-row">
            <div><CardBody title="Class" body={concept_class} /></div>
            <div><CardBody title="Data Type" body={datatype} /></div>
          </div>
          <MappingPreview title="Mappings" body={mapping} />
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            id="addConcept"
            onClick={() => {
              addConcept(url, display_name);
              closeModal();
            }}
          >
            Add
          </Button>
          &nbsp;
          <Button color="secondary" id="previewModalCloseBtn" onClick={() => closeModal()}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

PreviewCard.propTypes = {
  closeModal: PropTypes.func.isRequired,
  addConcept: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  concept: PropTypes.shape({
    display_name: PropTypes.string,
    descriptions: PropTypes.array,
    mappings: PropTypes.any,
    display_locale: PropTypes.string,
    concept_class: PropTypes.string,
    datatype: PropTypes.string,
  }).isRequired,
};

export default PreviewCard;
