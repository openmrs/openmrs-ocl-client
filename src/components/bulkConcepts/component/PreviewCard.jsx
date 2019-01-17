import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Modal, ModalBody, ModalFooter,
} from 'reactstrap';
import CardBody from './CardBody';

const PreviewCard = ({
  open, concept, closeModal, addConcept,
}) => {
  const {
    display_name, descriptions, mappings, display_locale, id, url,
  } = concept;

  const mapping = mappings ? mappings.length : 'none';
  return (
    <div className="col-9">
      <Modal isOpen={open} className="modal-sm">
        <ModalBody>
          <h6>{`Id ${id}`}</h6>
          <div className="header-divider" />
          <p className="synonyms">
         Name
            &nbsp;
            <small>
              <em className="float-right">{display_locale}</em>
            </small>
          </p>
          <div className="pop-up-description rounded">{display_name}</div>
          <CardBody title="Description" body={descriptions ? descriptions[0].description : ''} />
          <CardBody title="Mappings" body={mapping} />
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
  }).isRequired,
};

export default PreviewCard;
