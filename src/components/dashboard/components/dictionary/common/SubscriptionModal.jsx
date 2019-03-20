import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input,
} from 'reactstrap';
import { TRADITIONAL_OCL_HOST } from '../../../../dictionaryConcepts/components/helperFunction';

const SubscriptionModal = (props) => {
  const { show, click, url } = props;
  const subUrl = `${TRADITIONAL_OCL_HOST}${url}`;
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
            className="btn btn-danger"
            id="sub-cancel"
            onClick={click}
          >
             Close
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
