import React from 'react';
import { Button, Modal, FormGroup, FormControl } from 'react-bootstrap';
import PropTypes from 'prop-types';

const ReleaseVersionModal = (props) => {
  const {
    show, click, handleCreateVersion, handleChange, versionId, versionDescription, inputLength,
  } = props;
  return (
    <div className="modal-container">
      <Modal
        show={show}
        onHide={click}
        className="modal-fade"
      >
        <Modal.Header>
          <Modal.Title className="modal-heading">
              Release a new version
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <FormGroup>
            Version:
            <FormControl
              type="text"
              id="versionId"
              name="versionId"
              value={versionId}
              onChange={handleChange}
              placeholder="Version Number"
            />
          </FormGroup>

          <FormGroup style={{ marginTop: '12px' }}>
            Description(Optional):
            <FormControl
              componentClass="textarea"
              id="versionDescription"
              name="versionDescription"
              value={versionDescription}
              onChange={handleChange}
              placeholder="Version Description"
            />
          </FormGroup>
        </Modal.Body>

        <Modal.Footer>
          {inputLength > 0 ?
            <Button
              className="btn-sm btn-outline-info version"
              id="addDictionary"
              onClick={handleCreateVersion}
            >
               Release
            </Button> : <Button
              className="btn-sm btn-outline-info version-disabled"
              disabled
            >
               Release
            </Button>}
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

ReleaseVersionModal.propTypes = {
  show: PropTypes.bool.isRequired,
  click: PropTypes.func.isRequired,
  handleCreateVersion: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  versionId: PropTypes.string.isRequired,
  versionDescription: PropTypes.string.isRequired,
  inputLength: PropTypes.number.isRequired,
};

export default ReleaseVersionModal;
