import React from 'react';
import PropTypes from 'prop-types';
import AsyncMulti from '../containers/SelectAnswers';
import AnswerRow from './AnswerRow';

const AnswersTable = (props) => {
  const {
    handleAsyncSelectChange, queryAnswers, selectedAnswers, handleAnswerChange,
  } = props;

  return (
    <table className="table table-striped table-bordered concept-form-table">
      <thead className="header text-white">
        <tr>
          <th scope="col" colSpan="6">Answers</th>
        </tr>
      </thead>
      <tbody>
        {selectedAnswers.map(ans => (
          <AnswerRow
            key={ans.id}
            id={ans.id}
            display_name={ans.display_name}
            handleAnswerChange={handleAnswerChange}
          />
        ))}
        <tr>
          <td colSpan="8">
            <AsyncMulti
              handleAsyncSelectChange={handleAsyncSelectChange}
              queryAnswers={queryAnswers}
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
};

AnswersTable.propTypes = {
  handleAsyncSelectChange: PropTypes.func.isRequired,
  queryAnswers: PropTypes.func.isRequired,
  selectedAnswers: PropTypes.array.isRequired,
  handleAnswerChange: PropTypes.func.isRequired,
};

export default AnswersTable;
