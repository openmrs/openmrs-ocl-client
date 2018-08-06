import React from 'react';
import PropTypes from 'prop-types';

const Paginations = props => (
  <div className="row mt-2 pagination-container">
    <div className="space-between">
      <p>
        Showing 1-{props.totalConcepts} of {props.totalConcepts} concepts
      </p>
      <span className="paginate-controllers">
        <i
          className="fas fa-chevron-left left-arrow disabled-pagination-button"
          role="presentation"
        />

        <i className="fas fa-chevron-right disabled-pagination-button" role="presentation" />
      </span>
    </div>
  </div>
);

Paginations.propTypes = {
  totalConcepts: PropTypes.number.isRequired,
};

export default Paginations;
