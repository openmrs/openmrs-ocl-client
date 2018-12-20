import React, { Component } from 'react';
import AsyncSelect from 'react-select/lib/Async';
import PropTypes from 'prop-types';

class AsyncMulti extends Component {
    state = { inputValue: '' }

    handleChange = (arr) => {
      const { handleAsyncSelectChange } = this.props;
      handleAsyncSelectChange(arr);
    };

    handleInputChange = (value) => {
      this.setState({ inputValue: value });
    }

    render() {
      const { inputValue } = this.state;
      const { queryAnswers } = this.props;
      return (
        <AsyncSelect
          isMulti
          cacheOptions
          loadOptions={async () => queryAnswers(inputValue)}
          onChange={this.handleChange}
          onInputChange={this.handleInputChange}
          placeholder="Search possible answer concepts"
        />
      );
    }
}

AsyncMulti.propTypes = {
  handleAsyncSelectChange: PropTypes.func.isRequired,
  queryAnswers: PropTypes.func.isRequired,
};

export default AsyncMulti;
