import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import ActionButtons from './ActionButtons';
import { conceptsProps } from '../proptypes';
import { getUsername } from './helperFunction';
import RemoveConcept from './RemoveConcept';

const showCellContents = cell => <span>
  {cell.value[1] ? <del className="text-muted">{cell.value[0]}</del> : cell.value[0]}
</span>;

const ConceptTable = ({
  concepts,
  loading,
  org,
  locationPath,
  showDeleteModal,
  url,
  handleDelete,
  conceptLimit,
  closeDeleteModal,
  openDeleteModal,
  showDeleteMappingModal,
  handleDeleteMapping,
  retireConcept,
  updateConcept,
  isOwner,
  page,
  onPageChange,
}) => (
  <div className="row col-12 custom-concept-list">
    <RemoveConcept
      collectionName={locationPath.collectionName}
      conceptOwner={locationPath.typeName}
      conceptUrl={url}
      conceptType={locationPath.type}
      handleDelete={handleDelete}
      disableButton={loading}
      openDeleteModal={openDeleteModal}
      closeDeleteModal={closeDeleteModal}
    />
    <ReactTable
      data={concepts}
      loading={loading}
      pageSizeOptions={[5, 10, 20, 25, 50, 100]}
      defaultPageSize={conceptLimit}
      noDataText="No concepts found!"
      minRows={2}
      page={page}
      onPageChange={onPageChange}
      columns={[
        {
          Header: 'Name',
          id: 'nameCol',
          accessor: concept => [concept.display_name, concept.retired],
          minWidth: 100,
          Cell: cell => showCellContents(cell),
        },
        {
          Header: 'Class',
          id: 'classCol',
          accessor: concept => [concept.concept_class, concept.retired],
          Cell: cell => showCellContents(cell),
        },
        {
          Header: 'Source - ID',
          id: 'sourceCol',
          accessor: concept => [`${concept.source} - ${concept.id}`, concept.retired],
          Cell: cell => showCellContents(cell),
        },
        {
          Header: 'Action',
          width: 350,
          Cell: ({ original: concept }) => {
            const props = {
              showDeleteModal,
              handleDelete,
              handleDeleteMapping,
              mappingLimit: conceptLimit,
              showDeleteMappingModal,
              retireConcept,
              updateConcept,
            };
            const username = getUsername();
            const renderButtons = username === concept.owner || (
              concept.owner === org.name && org.userIsMember
            ) || isOwner;
            return <ActionButtons actionButtons={renderButtons} {...concept} {...props} />;
          },
        },
      ]}
      className="-striped -highlight custom-table-width"
    />
  </div>
);

ConceptTable.propTypes = {
  concepts: PropTypes.arrayOf(PropTypes.shape(conceptsProps)).isRequired,
  loading: PropTypes.bool.isRequired,
  original: PropTypes.object,
  org: PropTypes.object.isRequired,
  locationPath: PropTypes.object.isRequired,
  showDeleteModal: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  url: PropTypes.string,
  conceptLimit: PropTypes.number.isRequired,
  openDeleteModal: PropTypes.bool,
  closeDeleteModal: PropTypes.func.isRequired,
  handleDeleteMapping: PropTypes.func.isRequired,
  showDeleteMappingModal: PropTypes.func.isRequired,
  retireConcept: PropTypes.func,
  updateConcept: PropTypes.func,
  isOwner: PropTypes.bool,
  page: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};
ConceptTable.defaultProps = {
  openDeleteModal: false,
  url: '',
  original: {},
  retireConcept: () => {},
  updateConcept: () => {},
  isOwner: false,
};

export default ConceptTable;
