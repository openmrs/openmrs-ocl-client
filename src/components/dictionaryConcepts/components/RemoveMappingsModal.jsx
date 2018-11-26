import React from 'react';
import {
  Button, Modal, ModalHeader, ModalFooter,
} from 'reactstrap';
import PropTypes from 'prop-types';

const removeMapping = (props) => {
  const {
    handleDeleteMapping,
    modal,
    toggle,
    url,
  } = props;
  return (
    <div>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          Are you sure you want to Remove this Mapping?
        </ModalHeader>
        <ModalFooter>
          <Button id="retireMapping" color="danger" onClick={() => { handleDeleteMapping(url); toggle(); }}>Remove Mapping</Button>
          {' '}
          <Button color="secondary" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

removeMapping.propTypes = {
  handleDeleteMapping: PropTypes.func.isRequired,
  modal: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired,
};

export default removeMapping;
