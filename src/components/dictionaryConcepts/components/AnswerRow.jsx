import React from 'react';
import PropTypes from 'prop-types';
import SelectAnswers from '../containers/SelectAnswers';
import { INTERNAL_MAPPING_DEFAULT_SOURCE } from './helperFunction';


class AnswerRow extends React.Component {
  constructor(props) {
    super(props);
    const DEFAULT_SOURCE = localStorage.getItem('dictionaryId');
    this.state = {
      source: DEFAULT_SOURCE,
    };
  }

  handleChangeInSource = (event) => {
    const newSource = event.target.value;
    this.setState({
      source: newSource,
    });
  }

  render() {
    const {
      removeAnswerRow,
      currentDictionaryName,
      handleAsyncSelectChange,
      frontEndUniqueKey,
      toConceptName,
      toSourceName,
      isEditConcept,
      prePopulated,
      answerUrl,
    } = this.props;
    const { source } = this.state;
    return (
      <tr>
        <td>
          {
            isEditConcept && prePopulated ? (
              <input
                type="text"
                className="form-control"
                defaultValue={toSourceName}
                required
              />
            ) : (
              <select
                name="map_scope"
                className="form-control"
                onChange={event => this.handleChangeInSource(event)}
                required
              >
                <option value={localStorage.getItem('dictionaryId')}>
                  {currentDictionaryName}
                  &nbsp;(Dictionary)
                </option>
                <option value={INTERNAL_MAPPING_DEFAULT_SOURCE}>
                  {INTERNAL_MAPPING_DEFAULT_SOURCE}
                  &nbsp;(Source)
                </option>
              </select>
            )
          }
        </td>
        <td className="react-async">
          {
          isEditConcept && prePopulated ? (
            <input
              type="text"
              className="form-control"
              defaultValue={toConceptName}
              required
            />
          ) : (
            <SelectAnswers
              handleAsyncSelectChange={handleAsyncSelectChange}
              source={source}
              frontEndUniqueKey={frontEndUniqueKey}
              isShown={false}
            />
          )
        }
        </td>
        <td>
          <button
            className="btn btn-danger"
            type="button"
            onClick={() => removeAnswerRow(
              frontEndUniqueKey,
              isEditConcept,
              answerUrl,
              toConceptName,
              prePopulated,
            )}
            id="removeAnswer"
          >
                remove
          </button>
        </td>
      </tr>

    );
  }
}


AnswerRow.propTypes = {
  display_name: PropTypes.string,
  handleAnswerChange: PropTypes.func.isRequired,
  id: PropTypes.string,
  answerUrl: PropTypes.string,
  prePopulated: PropTypes.bool,
  isEditConcept: PropTypes.bool.isRequired,
  removeAnswerRow: PropTypes.func.isRequired,
  toConceptName: PropTypes.string,
  toSourceName: PropTypes.string,
  frontEndUniqueKey: PropTypes.string,
  handleAsyncSelectChange: PropTypes.func.isRequired,
  currentDictionaryName: PropTypes.string,
};

AnswerRow.defaultProps = {
  display_name: '',
  id: '',
  answerUrl: '',
  prePopulated: false,
  toConceptName: '',
  toSourceName: '',
  currentDictionaryName: '',
  frontEndUniqueKey: 'unique',
};


export default AnswerRow;
