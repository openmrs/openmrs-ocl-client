import React from 'react';
import PropTypes from 'prop-types';

const Paginations = props => (
  <div className="row mt-2 pagination-container">
    <div className="col-10">
      <i>
        Showing {props.firstConceptIndex}-{props.concepts} of {props.totalConcepts} concepts
      </i>
      <span className="paginate-controllers">
        {props.currentPage > 1 ?
          <i
            className="fas fa-angle-double-left prev"
            role="presentation"
            id={props.currentPage - 1}
            onClick={props.handleClick}
          /> : <i
            className="fas fa-angle-double-left disabled"
            role="presentation"
          />}
        <span className="badge badge-light"><h6>{props.currentPage}</h6></span>
        {props.currentPage < props.lastPage ?
          <i
            className="fas fa-angle-double-right nxt"
            role="presentation"
            id={props.currentPage + 1}
            onClick={props.handleClick}
          /> : <i
            className="fas fa-angle-double-right disabled"
            role="presentation"
          />}
      </span>
    </div>
    <div className="col-2">
      <select
        className="form-inline input-sm"
        onChange={e => props.onChangeLimit(e.target.value)}
      >
        <option value="50">50</option>
        <option value="100">100</option>
        <option value="150">150</option>
        <option value="200">200</option>
      </select>
    </div>
  </div>
);

Paginations.propTypes = {
  totalConcepts: PropTypes.number.isRequired,
  firstConceptIndex: PropTypes.number.isRequired,
  concepts: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  lastPage: PropTypes.number.isRequired,
  handleClick: PropTypes.func.isRequired,
  onChangeLimit: PropTypes.func.isRequired,
};

export default Paginations;
