import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { notify } from 'react-notify-toast';
import { queryAnswers } from '../../../redux/actions/concepts/dictionaryConcepts';
import {
  KEY_CODE_FOR_ENTER,
  KEY_CODE_FOR_ESCAPE, MAP_TYPE,
} from '../components/helperFunction';
import { MIN_CHARACTERS_WARNING, MILLISECONDS_TO_SHOW_WARNING } from '../../../redux/reducers/generalSearchReducer';

class SelectAnswers extends Component {
  state = {
    inputValue: '',
    options: [],
    isVisible: false,
    isClicked: false,
    hasReset: false,
  }

  componentDidMount() {
    this.setState({ inputValue: this.props.defaultValue });
  }

    resetInput = (e) => {
      const value = String(e.key).length === 1 ? e.key : '';
      const {
        answer, removeCurrentAnswer, answerUrl, frontEndUniqueKey,
      } = this.props;
      if (answer.prePopulated) {
        this.setState({ inputValue: value, hasReset: true });
        removeCurrentAnswer({ answerUrl, frontEndUniqueKey, answer });
      }
    };

    handleInputChange = (value) => {
      const { hasReset } = this.state;
      if (!hasReset) {
        this.setState({ inputValue: value });
      } else {
        this.setState({ hasReset: false });
      }
    }

    handleKeyDown = async (event, inputValue) => {
      const { isClicked } = this.state;
      const { mapType } = this.props;
      if (!isClicked) {
        this.resetInput(event);
        this.setState({ isClicked: true });
      }
      if (isClicked && (event.keyCode === KEY_CODE_FOR_ENTER) && inputValue.length >= 3) {
        const { source } = this.props;
        const options = await queryAnswers(source, inputValue, mapType);
        this.setState({ options, isVisible: true });
      } else if (isClicked && (event.keyCode === KEY_CODE_FOR_ENTER) && (inputValue.length < 3)) {
        notify.show(MIN_CHARACTERS_WARNING, 'error', MILLISECONDS_TO_SHOW_WARNING);
        this.setState({ isVisible: false });
      } else if (isClicked && event.keyCode === KEY_CODE_FOR_ESCAPE) {
        this.setState({ isVisible: false });
      }
    }

    handleSelect = (res) => {
      const { handleAsyncSelectChange, frontEndUniqueKey } = this.props;
      this.setState({ isVisible: false, inputValue: res.label });
      handleAsyncSelectChange(res, frontEndUniqueKey);
    };

    render() {
      const { inputValue } = this.state;
      const { index, isShown } = this.props;
      return (
        <div className="conceptDetails">
          <input
            tabIndex={index}
            className="form-control"
            placeholder="Search"
            type="text"
            id="searchInputCiel"
            name="to_concept_name"
            value={inputValue}
            onChange={e => this.handleInputChange(e.target.value)}
            onKeyDown={e => this.handleKeyDown(e, inputValue)}
          />
          {(this.state.isVisible || isShown) && <ul className="cielConceptsList">
            {this.state.options.map(result => <li key={result.uuid}>
              <button
                type="button"
                id="selectConcept"
                name="selectButton"
                onClick={() => this.handleSelect(result)}
              >
                {`ID(${result.id}) - ${result.display_name}`}
              </button>
            </li>)}
          </ul>}
        </div>
      );
    }
}

SelectAnswers.propTypes = {
  handleAsyncSelectChange: PropTypes.func.isRequired,
  source: PropTypes.string,
  defaultValue: PropTypes.string,
  frontEndUniqueKey: PropTypes.string.isRequired,
  index: PropTypes.number,
  isShown: PropTypes.bool,
  answer: PropTypes.object,
  removeCurrentAnswer: PropTypes.func.isRequired,
  answerUrl: PropTypes.string,
  mapType: PropTypes.string,
};

SelectAnswers.defaultProps = {
  source: '',
  defaultValue: '',
  index: 0,
  isShown: false,
  answer: {},
  answerUrl: '',
  mapType: MAP_TYPE.questionAndAnswer,
};

export default SelectAnswers;
