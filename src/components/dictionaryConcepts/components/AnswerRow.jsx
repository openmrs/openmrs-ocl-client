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
      isClicked: false,
    };
  }

  componentDidMount() {
    this.setState({
      isEditing: this.props.isEditConcept,
      isPrePopulated: this.props.prePopulated,
    });
  }

  handleChangeInSource = (event) => {
    const newSource = event.target.value;
    this.resetInput(event);
    this.setState({
      source: newSource,
    });
  }

  handleClick = () => {
    const { toSourceName } = this.props;
    if (!this.state.isClicked) {
      this.setState({
        isClicked: true,
        isEditing: false,
        isPrePopulated: false,
        source: toSourceName,
      });
    }
  }

  resetInput = () => {
    const {
      answer, removeCurrentAnswer, answerUrl, frontEndUniqueKey,
    } = this.props;
    if (answer.prePopulated) {
      removeCurrentAnswer({ answerUrl, frontEndUniqueKey, answer });
    }
  };

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
      removeCurrentAnswer,
      answer,
      mapType,
    } = this.props;
    const { source, isEditing, isPrePopulated } = this.state;
    return (
      <tr>
        <td>
          {
            isEditing && isPrePopulated ? (
              <input
                type="text"
                className="form-control"
                defaultValue={toSourceName.toUpperCase()}
                onClick={this.handleClick}
                required
              />
            ) : (
              <select
                name="map_scope"
                className="custom-select"
                onChange={event => this.handleChangeInSource(event)}
                defaultValue={toSourceName}
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
            <SelectAnswers
              handleAsyncSelectChange={handleAsyncSelectChange}
              source={source}
              frontEndUniqueKey={frontEndUniqueKey}
              isShown={false}
              defaultValue={toConceptName}
              removeCurrentAnswer={removeCurrentAnswer}
              answer={answer}
              answerUrl={answerUrl}
              mapType={mapType}
              handleClick={this.handleClick}
            />
        }
        </td>
        <td>
          <button
            className="btn btn-outline-danger"
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
  removeCurrentAnswer: PropTypes.func.isRequired,
  currentDictionaryName: PropTypes.string,
  answer: PropTypes.object.isRequired,
  mapType: PropTypes.string.isRequired,
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
