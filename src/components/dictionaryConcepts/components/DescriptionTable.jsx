import React from 'react';
import PropTypes from 'prop-types';
import DescriptionRow from './DescriptionRow';

const DescriptionTable = props => (
  <table className="table table-striped table-bordered concept-form-table">
    <thead className="header text-white">
      <tr>
        <th scope="col">Description</th>
        <th scope="col">Language</th>
        <th scope="col">Actions</th>
      </tr>
    </thead>
    <tbody>
      {props.existingConcept && props.existingConcept.descriptions
        ? props.existingConcept.descriptions.map(newRow => (
          <DescriptionRow
            newRow={newRow}
            rowId={newRow.uuid}
            key={newRow.uuid}
            {...props}
          />
        ))
        : props.description.map(newRow => (
          <DescriptionRow
            newRowUuid={newRow}
            rowId={newRow}
            key={newRow}
            {...props}
          />))
      }
    </tbody>
  </table>
);

DescriptionTable.propTypes = {
  description: PropTypes.array.isRequired,
  existingConcept: PropTypes.object.isRequired,
};
export default DescriptionTable;
