import React from 'react';
import PropTypes from 'prop-types';

const SearchBar = ({
  handleChange, searchInput, handleSearch,
}) => (
  <div className="row search-container">
    <div className="concept-search-wrapper col-9 col-md-5 col-sm-8">
      <i className="fa fa-search search-icons" aria-hidden="true" />
      <form onSubmit={handleSearch} id="submit-search-form">
        <input
          type="search"
          name="searchInput"
          className="concept-search"
          id="search-concept"
          value={searchInput}
          onChange={handleChange}
          placeholder="search concept"
          required
        />
        <button type="submit" className="search-button"><i className="fas fa-arrow-right" /></button>
      </form>
    </div>
  </div>
);

SearchBar.propTypes = {
  handleSearch: PropTypes.func.isRequired,
  searchInput: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default SearchBar;
