import React from 'react';
import PropTypes from 'prop-types';

const Loader = ({ smaller }) => (
  <div className={`${smaller ? 'smaller-loader' : 'loader'}`} />
);

Loader.propTypes = {
  smaller: PropTypes.bool,
};

Loader.defaultProps = {
  smaller: false,
};

export default Loader;
