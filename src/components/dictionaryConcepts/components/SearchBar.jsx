import React from 'react';
import PropTypes from 'prop-types';

const SearchBar = ({ conceptsCount, totalConceptsCount }) => (
  <div className="row search-container">
    <div className="concept-search-wrapper col-12 col-md-5 col-sm-8">
      <i className="fa fa-search search-icons" aria-hidden="true" />
      <input
        type="search"
        name="search-concept"
        className="concept-search"
        id="search-concept"
        disabled
        placeholder="search"
      />
    </div>
    <div className="search-pagination col-12 col-md-5 offset-md-1 offset-lg-1 col-sm-5">
      <span className="paginate-count">
        Showing 1 - {conceptsCount} of {totalConceptsCount} concepts
      </span>
    </div>
  </div>
);

SearchBar.propTypes = {
  conceptsCount: PropTypes.number.isRequired,
  totalConceptsCount: PropTypes.number.isRequired,
};

export default SearchBar;
