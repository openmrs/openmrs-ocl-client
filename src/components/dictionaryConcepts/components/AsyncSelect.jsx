import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Async from 'react-select/lib/Async';
import { getAsyncSelectDetails } from '../../../redux/actions/concepts/dictionaryConcepts';

export default class AsyncSelect extends Component {
  state = {
    selectedOption: null,
  }

  filterOptions = (inputValue, concepts) => concepts.filter(
    i => i.label.toLowerCase().includes(inputValue.toLowerCase()),
  );

  loadOptions = async (inputValue, callback) => {
    const {
      sourceUrl, ignoreValue, valueKey, labelKey,
    } = this.props;
    const options = [];
    await getAsyncSelectDetails(sourceUrl).then(response => response.data.map(
      option => ignoreValue !== option[valueKey]
        && options.push({
          value: option[valueKey],
          label: option[labelKey],
        }),
    ));
    callback(this.filterOptions(inputValue, options));
  };

  handleInputChange = (newValue) => {
    const inputValue = newValue.replace(/\W/g, '');
    return inputValue;
  };

  handleOnChange = (data) => {
    const { onChange, name } = this.props;
    this.setState({ selectedOption: data });
    onChange({ name, ...data });
  }

  render() {
    const {
      placeholder, disabled,
    } = this.props;
    const { selectedOption } = this.state;
    return (
      <Async
        cacheOptions
        defaultOptions
        loadOptions={this.loadOptions}
        onInputChange={this.handleInputChange}
        onChange={this.handleOnChange}
        placeholder={placeholder}
        isDisabled={disabled}
        className="react-select"
        classNamePrefix="react-select"
        value={selectedOption}
      />
    );
  }
}

AsyncSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  sourceUrl: PropTypes.string.isRequired,
  ignoreValue: PropTypes.string,
  valueKey: PropTypes.string.isRequired,
  labelKey: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

AsyncSelect.defaultProps = {
  name: '',
  placeholder: '',
  ignoreValue: '',
  disabled: false,
};
