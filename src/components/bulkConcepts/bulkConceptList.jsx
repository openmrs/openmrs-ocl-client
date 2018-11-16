import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import Loader from '../Loader';

const BulkConceptList = ({
  cielConcepts,
  fetching,
  handleSelect,
  conceptLimit,
  filterConcept,
}) => {
  const filter = { filterMethod: filterConcept, filterAll: true };
  if (cielConcepts.length >= 1) {
    return (
      <ReactTable
        data={cielConcepts}
        loading={fetching}
        defaultPageSize={cielConcepts.length <= conceptLimit ? cielConcepts.length : conceptLimit}
        filterable
        noDataText="No concept!"
        minRows={0}
        columns={[
          {
            Header: 'Select',
            accessor: 'select',
            filterable: false,
            minWidth: 300,
            Cell: ({ original: concept }) => (
              <div className="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  className="table-check"
                  value={concept.url}
                  onChange={handleSelect}
                />
              </div>
            ),
          },
          {
            Header: 'Name',
            accessor: 'display_name',
            minWidth: 300,
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
        ]}
        className="-striped -highlight"
      />
    );
  }
  if (fetching) {
    return (
      <div className="text-center mt-3">
        <Loader />
      </div>
    );
  }
  return (
    <div className="text-center mt-3">
      <h5>No concept found</h5>
    </div>
  );
};
BulkConceptList.propTypes = {
  fetching: PropTypes.bool.isRequired,
  cielConcepts: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
  })).isRequired,
  handleSelect: PropTypes.func.isRequired,
  conceptLimit: PropTypes.number.isRequired,
  filterConcept: PropTypes.func.isRequired,


};
export default BulkConceptList;
