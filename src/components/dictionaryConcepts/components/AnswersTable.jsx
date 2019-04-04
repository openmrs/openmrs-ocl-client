import React from 'react';
import PropTypes from 'prop-types';
import AnswerRow from './AnswerRow';

const AnswersTable = (props) => {
  const {
    handleAsyncSelectChange,
    selectedAnswers,
    handleAnswerChange,
    removeAnswerRow,
    currentDictionaryName,
    isEditConcept,
  } = props;
  return (
    <table className="table table-striped table-bordered concept-form-table">
      <thead className="header text-white">
        <tr>
          <th scope="col">Source</th>
          <th scope="col">Concept</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        {selectedAnswers.map((ans, index) => (
          <AnswerRow
            frontEndUniqueKey={ans.frontEndUniqueKey}
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            toConceptName={ans.to_concept_name}
            answerUrl={ans.url}
            prePopulated={ans.prePopulated}
            handleAnswerChange={handleAnswerChange}
            removeAnswerRow={removeAnswerRow}
            currentDictionaryName={currentDictionaryName}
            handleAsyncSelectChange={handleAsyncSelectChange}
            isEditConcept={isEditConcept}
          />
        ))}
      </tbody>
    </table>
  );
};

AnswersTable.propTypes = {
  handleAsyncSelectChange: PropTypes.func.isRequired,
  selectedAnswers: PropTypes.array.isRequired,
  handleAnswerChange: PropTypes.func,
  isEditConcept: PropTypes.bool.isRequired,
  removeAnswerRow: PropTypes.func,
  currentDictionaryName: PropTypes.string,
};

AnswersTable.defaultProps = {
  handleAnswerChange: () => {},
  currentDictionaryName: '',
  removeAnswerRow: () => {},
};

export default AnswersTable;
