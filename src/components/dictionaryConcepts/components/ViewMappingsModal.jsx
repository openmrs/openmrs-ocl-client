import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';
import { conceptsProps } from '../proptypes';
import AddMapping from './AddMapping';
import { editMapping } from '../../../redux/actions/dictionaries/dictionaryActionCreators';
import RemoveMappings from './RemoveMappings';

export const ViewMappingsModal = ({
  handleToggle,
  modal,
  mappings,
  mappingLimit,
  displayName,
  source,
  editMapping,
  concepts,
  handleDeleteMapping,
  showDeleteMappingModal,
}) => (
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
              {
                Header: 'Action',
                id: 'row',
                filterable: false,
                sortable: false,
                Cell: ({ original: mapping }) => (
                  <React.Fragment>
                    <AddMapping
                      buttonName="Edit"
                      to_concept_url={mapping.to_concept_url}
                      url={mapping.url}
                      map_type={mapping.map_type}
                      to_concept_name={mapping.to_concept_name}
                      source={source}
                      editMapping={editMapping}
                      concepts={concepts}
                    />
                    <RemoveMappings
                      showDeleteMappingModal={showDeleteMappingModal}
                      handleDeleteMapping={handleDeleteMapping}
                      {...mapping}
                    />
                  </React.Fragment>
                ),
              },
            ]}
            className="-striped -highlight custom-table-width custom-table-min-height"
          />
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleToggle}>
              Close
        </Button>
      </ModalFooter>
    </Modal>
  </div>
);

ViewMappingsModal.propTypes = {
  modal: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
  mappings: conceptsProps.mappings.isRequired,
  showDeleteMappingModal: PropTypes.func.isRequired,
  handleDeleteMapping: PropTypes.func.isRequired,
};

export const mapStateToProps = state => ({
  concepts: state.concepts.dictionaryConcepts,
});

export default connect(
  mapStateToProps,
  { editMapping },
)(ViewMappingsModal);
