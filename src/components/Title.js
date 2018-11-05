import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

const Title = props => (
  <Helmet>
    <title>
      {props.title}
      {props.title ? ' - ' : ''}
      {' '}
OCL client
    </title>
  </Helmet>
);

Title.propTypes = {
  title: PropTypes.string,
};

Title.defaultProps = {
  title: '',
};

export default Title;
