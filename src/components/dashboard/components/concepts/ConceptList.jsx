import React from 'react';
import PropTypes from 'prop-types';
import Table from './ConceptTable';
import Loader from '../../../Loader';

const ConceptList = ({ concepts, fetching }) => {
  if (concepts.length >= 1) {
    return (
      <table className="table table-bordered table-striped">
        <thead className="header text-white">
          <tr>
            <th scope="col">ID</th>
            <th scope="col"><div>Name</div></th>
            <th scope="col">Class and Datatype</th>
            <th scope="col">Source</th>
          </tr>

        </thead>
        <tbody>

          {concepts.map(concept => (
            <Table concept={concept} key={concept.id} />
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

ConceptList.propTypes = {
  fetching: PropTypes.bool.isRequired,
  concepts: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
  })).isRequired,
};
export default ConceptList;
