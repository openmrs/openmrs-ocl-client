import React from 'react';
import PropTypes from 'prop-types';
import ConceptNameRows from './ConceptNameRows';

const CreateConceptTable = props => (
  <table className="table table-striped table-bordered concept-form-table">
    <thead className="header text-white">
      <tr>
        <th scope="col">Name</th>
        <th scope="col">Type</th>
        <th scope="col">Language</th>
        <th scope="col">Preferred in locale</th>
        <th scope="col">Actions</th>
      </tr>
    </thead>
    <tbody>
      {props.nameRows.map(newRow => <ConceptNameRows newRow={newRow} key={newRow} {...props} />)}
    </tbody>
  </table>
);

CreateConceptTable.propTypes = {
  nameRows: PropTypes.array.isRequired,
};

export default CreateConceptTable;
