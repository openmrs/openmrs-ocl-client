import React from 'react';
import PropTypes from 'prop-types';
import SpecificConceptTable from './SpecificConceptTable';
import Loader from '../../../Loader';
import '../../styles/index.css';

const SpecificConceptList = ({ concepts, fetching }) => {
  if (concepts.length >= 1) {
    return (
      <div className="text-center mt-3">
        <table className="table table-bordered table-striped">
          <thead className="header head">
            <tr>
              <th className="table1">ID</th>
              <th className="table2">Name</th>
              <th>Class{' '}/{' '}Datatype</th>
            </tr>
          </thead>
          <tbody>
            {concepts.map(concept => (
              <SpecificConceptTable concept={concept} key={concept.id} />
          ))}
          </tbody>
        </table>
      </div>
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

SpecificConceptList.propTypes = {
  fetching: PropTypes.bool.isRequired,
  concepts: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
  })).isRequired,
};
export default SpecificConceptList;
