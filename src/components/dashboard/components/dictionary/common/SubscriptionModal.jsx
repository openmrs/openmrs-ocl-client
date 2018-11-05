import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input,
} from 'reactstrap';

const SubscriptionModal = (props) => {
  const { show, click, url } = props;
  const subUrl = `https://qa.openconceptlab.org${url}`;
  return (
    <div className="modal-container">
      <Modal
        isOpen={show}
        onClosed={click}
        centered
      >
        <ModalHeader className="modal-heading">
              Subscription URL
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <Input
              type="text"
              id="subURL"
              name="subUrl"
              value={subUrl}
              readOnly
            />
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <Button
            className="btn-sm btn-outline-danger test-btn-cancel"
            id="sub-cancel"
            onClick={click}
          >
              Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

SubscriptionModal.propTypes = {
  show: PropTypes.bool.isRequired,
  click: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired,
};

export default SubscriptionModal;
