import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import { conceptsProps } from '../proptypes';
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';

const ViewMappingsModal = ({
  handleToggle,
  modal,
  mappings,
  mappingLimit,
  displayName
}) => {
    return (
      <div className="col-9">
        <Modal isOpen={modal} className="modal-lg">
          <ModalHeader>
            {`${displayName} Mappings`}
          </ModalHeader>
          <ModalBody>
            <div className="row col-12 custom-concept-list">
              <ReactTable
                data={mappings}
                defaultPageSize={mappings.length <= mappingLimit ? mappings.length : mappingLimit}
                filterable
                noDataText="No mappings!"
                minRows={0}
                columns={[
                  {
                    Header: 'From Concept Name',
                    accessor: 'from_concept_name',
                    minWidth: 100,
                  },
                  {
                    Header: 'To Concept Name',
                    accessor: 'to_concept_name',
                  },
                  {
                    Header: 'Map Type',
                    accessor: 'map_type',
                  },
                  {
                    Header: 'Dictionary',
                    accessor: 'source',
                  },
                ]}
                className="-striped -highlight custom-table-width"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={handleToggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
  );
};

ViewMappingsModal.propTypes = {
  modal: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
  mappings: conceptsProps.mappings.isRequired,
};

export default ViewMappingsModal;
