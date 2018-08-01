import React from 'react';
import PropTypes from 'prop-types';

const SearchBar = ({ handleSearch, searchValue, submit }) => (
  <div className="row search-container">
    <div className="concept-search-wrapper col-12 col-md-5 col-sm-8">
      <i className="fa fa-search search-icons" aria-hidden="true" />
      <form onSubmit={submit}>
        <input
          type="search"
          name="searchInput"
          className="concept-search"
          id="search-concept"
          value={searchValue}
          onChange={handleSearch}
          placeholder="search"
        />
      </form>
    </div>
  </div>
);

SearchBar.propTypes = {
  handleSearch: PropTypes.func.isRequired,
  searchValue: PropTypes.string.isRequired,
  submit: PropTypes.func.isRequired,
};

export default SearchBar;
