import React, { Component } from 'react';
import AsyncSelect from 'react-select/lib/Async';
import PropTypes from 'prop-types';
import { queryAnswers } from '../../../redux/actions/concepts/dictionaryConcepts';

class SelectAnswers extends Component {
  state = {
    inputValue: '',

  }

    handleChange = (arr) => {
      const { handleAsyncSelectChange, frontEndUniqueKey } = this.props;
      if (arr !== null) {
        handleAsyncSelectChange(arr, frontEndUniqueKey);
      }
    };

    handleInputChange = (value) => {
      this.setState({ inputValue: value });
    }

    render() {
      const { inputValue } = this.state;
      const { source } = this.props;
      return (
        <AsyncSelect
          isClearable
          cacheOptions
          loadOptions={async () => queryAnswers(source, inputValue)}
          onChange={this.handleChange}
          onInputChange={this.handleInputChange}
          placeholder="Search"
        />
      );
    }
}

SelectAnswers.propTypes = {
  handleAsyncSelectChange: PropTypes.func.isRequired,
  source: PropTypes.string,
  frontEndUniqueKey: PropTypes.string.isRequired,
};

SelectAnswers.defaultProps = {
  source: '',
};

export default SelectAnswers;
