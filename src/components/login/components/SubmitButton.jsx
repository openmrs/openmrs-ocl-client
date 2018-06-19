import React from 'react';
import PropTypes from 'prop-types';
import Loader from '../../Loader';

const SubmitButton = ({ buttonTitle, disable }) => (
  <button type="submit" className="btn btn-primary btn-block" disabled={disable}>
    {buttonTitle}{' '}
    {buttonTitle === 'Signing in...' && (
      <span className="spinner float-right">
        <Loader />
      </span>
    )}
  </button>
);

SubmitButton.propTypes = {
  buttonTitle: PropTypes.string.isRequired,
  disable: PropTypes.bool.isRequired,
};

export default SubmitButton;
