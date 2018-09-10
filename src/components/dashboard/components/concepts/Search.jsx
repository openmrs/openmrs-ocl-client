import React from 'react';
import PropTypes from 'prop-types';

const SearchConcepts = ({ onSearch, onSubmit, searchValue }) => (
  <div className="row justify-content-center search-container">
    <div className="concept-search-wrapper col-12 col-md-5 col-sm-8">
      <i className="fas fa-search fa-fw mr-1" />
      <form id="submit-search-form" onSubmit={onSubmit}>
        <input
          type="search"
          name="searchInput"
          id="search"
          value={searchValue}
          onChange={onSearch}
          className="concept-search"
          placeholder="Search for concepts"
        />
      </form>
    </div>
  </div>
);
SearchConcepts.propTypes = {
  onSearch: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  searchValue: PropTypes.string.isRequired,

};
export default SearchConcepts;
