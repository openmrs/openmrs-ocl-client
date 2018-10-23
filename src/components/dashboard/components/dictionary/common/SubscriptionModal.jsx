import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, FormGroup, FormControl } from 'react-bootstrap';

const SubscriptionModal = (props) => {
  const { show, click, url } = props;
  const subUrl = `https://qa.openconceptlab.org${url}`;
  return (
    <div className="modal-container">
      <Modal
        show={show}
        onHide={click}
        dialogClassName="custom-modal"
        className="modal-fade"
      >
        <Modal.Header>
          <Modal.Title className="modal-heading">
              Subscription URL
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <FormGroup>
            <FormControl
              type="text"
              id="subURL"
              name="subUrl"
              value={subUrl}
              readOnly
            />
          </FormGroup>
        </Modal.Body>

        <Modal.Footer>
          <Button
            className="btn-sm btn-outline-danger test-btn-cancel"
            id="sub-cancel"
            onClick={click}
          >
              Cancel
          </Button>
        </Modal.Footer>
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
