import React from 'react';
import PropTypes from 'prop-types';

const InlineError = ({ text }) => (
  <div><span id="inline-error"> {text} </span></div>
);
InlineError.propTypes = {
  text: PropTypes.string.isRequired,
};

export default InlineError;
