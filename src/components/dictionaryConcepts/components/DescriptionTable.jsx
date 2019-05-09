import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import DescriptionRow from './DescriptionRow';

class DescriptionTable extends PureComponent {
  render() {
    const { existingConcept, description } = this.props;
    const descriptions = existingConcept.descriptions || description;
    return (
      <table className="table table-striped table-bordered concept-form-table">
        <thead className="header text-white">
          <tr>
            <th scope="col">Description</th>
            <th scope="col">Language</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {descriptions.map(newRow => (
            <DescriptionRow newRow={newRow} rowId={newRow.uuid} key={newRow.uuid} {...this.props} />
          ))}
        </tbody>
      </table>
    );
  }
}

DescriptionTable.propTypes = {
  description: PropTypes.array.isRequired,
  existingConcept: PropTypes.object.isRequired,
};
export default DescriptionTable;
