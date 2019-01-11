import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';
import AddMapping from './AddMapping';
import { editMapping as edit } from '../../../redux/actions/dictionaries/dictionaryActionCreators';
import RemoveMappings from './RemoveMappings';

export class ViewMappingsModal extends Component {
  render() {
    const {
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
    } = this.props;

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
                  {
                    Header: 'Action',
                    id: 'row',
                    filterable: false,
                    sortable: false,
                    Cell: ({ original: mapping }) => {
                      const props = {
                        source,
                        editMapping,
                        concepts,
                        mappings,
                        buttonName: 'Edit',
                      };
                      return (
                        <React.Fragment>
                          <AddMapping
                            {...props}
                            {...mapping}
                          />
                          <RemoveMappings
                            showDeleteMappingModal={showDeleteMappingModal}
                            handleDeleteMapping={handleDeleteMapping}
                            {...mapping}
                          />
                        </React.Fragment>
                      );
                    },
                  },
                ]}
                className="-striped -highlight custom-table-width"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => handleToggle(false)}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

ViewMappingsModal.propTypes = {
  modal: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
  showDeleteMappingModal: PropTypes.func.isRequired,
  handleDeleteMapping: PropTypes.func.isRequired,
  editMapping: PropTypes.func,
  concepts: PropTypes.array,
  source: PropTypes.string,
  mappings: PropTypes.array.isRequired,
  displayName: PropTypes.string,
  mappingLimit: PropTypes.number,
};

ViewMappingsModal.defaultProps = {
  displayName: '',
  source: '',
  mappingLimit: 5,
  concepts: [],
  editMapping: () => {},
};

export const mapStateToProps = state => ({
  concepts: state.concepts.dictionaryConcepts,
});

export default connect(
  mapStateToProps,
  { editMapping: edit },
)(ViewMappingsModal);
