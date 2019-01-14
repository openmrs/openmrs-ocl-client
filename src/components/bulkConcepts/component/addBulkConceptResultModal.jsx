import React from 'react';
import {
  Button, Modal, ModalHeader, ModalFooter, Input,
} from 'reactstrap';
import PropTypes from 'prop-types';

const addBulkConceptResultModal = ({ openModal, closeModal, ids }) => (
  <div>
    <Modal isOpen={openModal} toggle={closeModal}>
      <ModalHeader toggle={closeModal}>
      Invalid Concept IDs
      </ModalHeader>
      <Input type="textarea" name="text" id="idsText" defaultValue={ids.join(', ')} rows="10" />
      <ModalFooter>
        <Button color="secondary" id="closeModal" onClick={closeModal}>Close</Button>
      </ModalFooter>
    </Modal>
  </div>
);

addBulkConceptResultModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  openModal: PropTypes.bool,
  ids: PropTypes.array.isRequired,
};

addBulkConceptResultModal.defaultProps = {
  openModal: false,
};

export default addBulkConceptResultModal;
