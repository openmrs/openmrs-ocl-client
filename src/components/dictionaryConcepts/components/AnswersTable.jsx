import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid/v4';
import AnswerRow from './AnswerRow';

const AnswersTable = (props) => {
  const {
    handleAsyncSelectChange,
    selectedAnswers,
    handleAnswerChange,
    removeAnswerRow,
    currentDictionaryName,
    isEditConcept,
    removeCurrentAnswer,
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
        {selectedAnswers.map((ans) => {
          // eslint-disable-next-line no-param-reassign
          ans.frontEndUniqueKey = ans.frontEndUniqueKey || uuid();
          return (
            <AnswerRow
              frontEndUniqueKey={ans.frontEndUniqueKey}
              key={ans.frontEndUniqueKey}
              toConceptName={ans.to_concept_name}
              toSourceName={ans.to_source_name}
              answerUrl={ans.url}
              prePopulated={ans.prePopulated}
              handleAnswerChange={handleAnswerChange}
              removeAnswerRow={removeAnswerRow}
              currentDictionaryName={currentDictionaryName}
              handleAsyncSelectChange={handleAsyncSelectChange}
              isEditConcept={isEditConcept}
              answer={ans}
              removeCurrentAnswer={removeCurrentAnswer}
            />
          );
        })}
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
  removeCurrentAnswer: PropTypes.func.isRequired,
};

AnswersTable.defaultProps = {
  handleAnswerChange: () => {},
  currentDictionaryName: '',
  removeAnswerRow: () => {},
};

export default AnswersTable;
