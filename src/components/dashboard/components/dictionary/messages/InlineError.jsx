import React from 'react';
import PropTypes from 'prop-types';

const InlineError = ({ text }) => (
  <div><span style={{ color: '#880000' }}> {text} </span></div>
);
InlineError.propTypes = {
  text: PropTypes.string.isRequired,
};

export default InlineError;
