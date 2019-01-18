import React from 'react';
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';
import PropTypes from 'prop-types';

const GeneralModal = (props) => {
  const {
    show, title, content, select_confirm,
    confirm_button, cancel_button, hide,
  } = props;
  return (
    <div className="modal-container">
      <Modal
        isOpen={show}
        onClosed={hide}
        centered
      >
        <ModalHeader className="modal-heading">
          {title}
        </ModalHeader>

        <ModalBody>
          {content}
        </ModalBody>

        <ModalFooter>
          <Button
            className="btn-sm btn-outline-info version"
            id="generalConfirmButton"
            onClick={select_confirm}
          >
            {confirm_button}
          </Button>

          <Button
            className="btn-sm btn-outline-danger test-btn-cancel"
            id="sub-cancel"
            onClick={hide}
          >
            {cancel_button}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

GeneralModal.propTypes = {
  show: PropTypes.bool.isRequired,
  hide: PropTypes.func.isRequired,
  select_confirm: PropTypes.func.isRequired,
  confirm_button: PropTypes.string.isRequired,
  cancel_button: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

export default GeneralModal;
