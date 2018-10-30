import React from 'react';
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input,
} from 'reactstrap';
import PropTypes from 'prop-types';

const ReleaseVersionModal = (props) => {
  const {
    show, click, handleCreateVersion, handleChange, versionId, versionDescription, inputLength,
  } = props;
  return (
    <div className="modal-container">
      <Modal
        isOpen={show}
        onClosed={click}
        centered
      >
        <ModalHeader className="modal-heading">
          Release a new version
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            Version:
            <Input
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
            <Input
              type="textarea"
              id="versionDescription"
              name="versionDescription"
              value={versionDescription}
              onChange={handleChange}
              placeholder="Version Description"
            />
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          {inputLength > 0
            ? (
              <Button
                className="btn-sm btn-outline-info version"
                id="addDictionary"
                onClick={handleCreateVersion}
              >
               Release
              </Button>
            ) : (
              <Button
                className="btn-sm btn-outline-info version-disabled"
                disabled
              >
               Release
              </Button>
            )}
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

ReleaseVersionModal.propTypes = {
  show: PropTypes.bool.isRequired,
  click: PropTypes.func.isRequired,
  handleCreateVersion: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  versionId: PropTypes.string,
  versionDescription: PropTypes.string,
  inputLength: PropTypes.number.isRequired,
};

ReleaseVersionModal.defaultProps = {
  versionId: '',
  versionDescription: '',
};

export default ReleaseVersionModal;
