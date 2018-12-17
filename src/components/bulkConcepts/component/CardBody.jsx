import React from 'react';
import PropTypes from 'prop-types';

const CardBody = ({ title, body }) => (
  <React.Fragment>
    <p className="synonyms">{title}</p>
    <div className="pop-up-description rounded">{body}</div>
  </React.Fragment>
);

CardBody.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
};

export default CardBody;
