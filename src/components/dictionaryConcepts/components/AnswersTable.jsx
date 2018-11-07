import React from 'react';
import PropTypes from 'prop-types';
import AnswersRow from './AnswersRow';

const AnswersTable = props => (
  <table className="table table-striped table-bordered concept-form-table">
    <thead className="header text-white">
      <tr>
        <th scope="col">To Concept URL</th>
        <th scope="col">Actions</th>
      </tr>
    </thead>
    <tbody>
      {props.answer.map(newRow => (
        <AnswersRow
          newRow={{ uuid: newRow }}
          key={newRow}
          {...props}
        />))}
    </tbody>
  </table>
);

AnswersTable.propTypes = {
  answer: PropTypes.array.isRequired,
};

export default AnswersTable;
