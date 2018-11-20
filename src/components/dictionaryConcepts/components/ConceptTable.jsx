import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import ActionButtons from './ActionButtons';
import Loader from '../../Loader';
import { conceptsProps } from '../proptypes';
import { getUsername } from './helperFunction';
import RemoveConcept from './RemoveConcept';

const username = getUsername();

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
  filterConcept,
}) => {
  const filter = { filterMethod: filterConcept, filterAll: true };
  if (concepts.length > 0) {
    return (
      <div className="row col-12 custom-concept-list">
        <RemoveConcept
          collectionName={locationPath.collectionName}
          conceptOwner={locationPath.typeName}
          conceptUrl={url}
          conceptType={locationPath.type}
          handleDelete={handleDelete}
          openDeleteModal={openDeleteModal}
          closeDeleteModal={closeDeleteModal}
        />
        <ReactTable
          data={concepts}
          loading={loading}
          defaultPageSize={concepts.length <= conceptLimit ? concepts.length : conceptLimit}
          filterable
          noDataText="No ceoncept!"
          minRows={0}
          columns={[
            {
              Header: 'Name',
              accessor: 'display_name',
              minWidth: 100,
              ...filter,
            },
            {
              Header: 'Class',
              accessor: 'concept_class',
              ...filter,
            },
            {
              Header: 'Datatype',
              accessor: 'datatype',
              ...filter,
            },
            {
              Header: 'Source',
              accessor: 'source',
              ...filter,
            },
            {
              Header: 'ID',
              accessor: 'id',
              ...filter,
            },
            {
              Header: 'Action',
              filterable: false,
              width: 250,
              Cell: ({ original: concept }) => {
                const props = {
                  showDeleteModal,
                  handleDelete,
                };
                const renderButtons = username === concept.owner || (
                  concept.owner === org.name && org.userIsMember
                );
                return <ActionButtons actionButtons={renderButtons} {...concept} {...props} />;
              },
            },
          ]}
          className="-striped -highlight custom-table-width"
        />
      </div>
    );
  }
  if (!loading && concepts.length <= 0) {
    return <div>No concepts found</div>;
  }
  return (
    <div className="mt-200 text-center">
      <Loader />
    </div>
  );
};

ConceptTable.propTypes = {
  concepts: PropTypes.arrayOf(PropTypes.shape(conceptsProps)).isRequired,
  loading: PropTypes.bool.isRequired,
  org: PropTypes.object.isRequired,
  locationPath: PropTypes.object.isRequired,
  showDeleteModal: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  url: PropTypes.string,
  conceptLimit: PropTypes.number.isRequired,
  openDeleteModal: PropTypes.bool,
  closeDeleteModal: PropTypes.func.isRequired,
  filterConcept: PropTypes.func.isRequired,
};
ConceptTable.defaultProps = {
  openDeleteModal: false,
  url: '',
};

export default ConceptTable;
