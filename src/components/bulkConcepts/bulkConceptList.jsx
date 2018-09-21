import React from 'react';
import PropTypes from 'prop-types';
import BulkConceptTable from './bulkConceptTable';
import Loader from '../Loader';

const BulkConceptList = ({
  cielConcepts, fetching, handleSelect,
}) => {
  if (cielConcepts.length >= 1) {
    return (
      <table className="table table-bordered table-striped">
        <thead className="header text-white">
          <tr>
            <th scope="col">Select</th>
            <th scope="col">Name</th>
            <th scope="col">Datatype</th>
            <th scope="col">Source</th>
            <th scope="col">ID</th>
          </tr>

        </thead>
        <tbody>

          {cielConcepts.map(concept => (
            <BulkConceptTable concept={concept} key={concept.id} handleSelect={handleSelect} />
    ))}
        </tbody>
      </table>
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
  handleSelect: PropTypes.func.isRequired,
  cielConcepts: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
  })).isRequired,
};
export default BulkConceptList;
