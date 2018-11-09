import React from 'react';
import { Button, Modal, ModalHeader, ModalFooter } from 'reactstrap';
import PropTypes from 'prop-types';

const removeConcept = (props) => {
  const { handleDelete, openDeleteModal, closeDeleteModal } = props;
  return (
    <div>
      <Modal isOpen={openDeleteModal} toggle={closeDeleteModal}>
        <ModalHeader toggle={closeDeleteModal}>
        Are you sure you want to Remove this Concept?
        </ModalHeader>
        <ModalFooter>
          <Button color="danger" onClick={handleDelete}>Remove concept</Button>{' '}
          <Button color="secondary" onClick={closeDeleteModal}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

removeConcept.propTypes = {
  handleDelete: PropTypes.func.isRequired,
  closeDeleteModal: PropTypes.func.isRequired,
  openDeleteModal: PropTypes.bool,
};

removeConcept.defaultProps = {
  openDeleteModal: false,
};

export default removeConcept;
