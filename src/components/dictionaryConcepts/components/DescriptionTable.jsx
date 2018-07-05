import React from 'react';
import PropTypes from 'prop-types';
import DescriptionRow from './DescriptionRow';

const DescriptionTable = props => (
  <table className="table table-striped table-bordered concept-form-table">
    <thead className="header text-white">
      <tr>
        <th scope="col">Language</th>
        <th scope="col">Description</th>
        <th scope="col">Actions</th>
      </tr>
    </thead>
    <tbody>
      {props.description.map(newRow => <DescriptionRow newRow={newRow} key={newRow} {...props} />)}
    </tbody>
  </table>
);

DescriptionTable.propTypes = {
  description: PropTypes.string.isRequired,
};
export default DescriptionTable;
