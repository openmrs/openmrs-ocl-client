import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import Loader from '../../Loader';
import ActionButtons from './ActionButtons';
import { conceptsProps } from '../../dictionaryConcepts/proptypes';

const ConceptTable = ({
  concepts, loading, location, preview, previewConcept, addConcept, conceptLimit, filterConcept,
}) => {
  if (loading) {
    return (
      <div className="mt-200 text-center">
        <Loader />
      </div>
    );
  }
  const filter = { filterMethod: filterConcept, filterAll: true };
  return (
      <div className="row col-12 custom-concept-list">
        <ReactTable
          data={concepts}
          loading={loading}
          defaultPageSize={concepts.length <= conceptLimit ? concepts.length : conceptLimit}
          filterable
          noDataText="No concepts found!"
          minRows={2}
          columns={[
            {
              Header: 'Name',
              accessor: 'display_name',
              minWidth: 300,
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
              Cell: ({ original: concept }) => (
                <ActionButtons
                  preview={preview}
                  previewConcept={previewConcept}
                  addConcept={addConcept}
                  params={location}
                  {...concept}
                />
              ),
            },
          ]}
          className="-striped -highlight"
        />
      </div>
  );
};

ConceptTable.propTypes = {
  concepts: PropTypes.arrayOf(PropTypes.shape(conceptsProps)).isRequired,
  loading: PropTypes.bool.isRequired,
  location: PropTypes.shape({
    type: PropTypes.string,
    typeName: PropTypes.string,
    collectionName: PropTypes.string,
  }).isRequired,
  preview: PropTypes.shape({
    url: PropTypes.string,
    display_name: PropTypes.string,
  }).isRequired,
  addConcept: PropTypes.func.isRequired,
  filterConcept: PropTypes.func.isRequired,
  previewConcept: PropTypes.func.isRequired,
  conceptLimit: PropTypes.number.isRequired,
};

export default ConceptTable;
