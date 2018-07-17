import React from 'react';
import PropTypes from 'prop-types';

const GeneralSearch = ({ onSearch, onSubmit, searchValue }) => (
  <form className="form-inline" id="generalSearchForm" onSubmit={onSubmit}>
    <input
      className="form-control mr-sm-2"
      name="searchInput"
      id="generalSearch"
      type="search"
      value={searchValue}
      onChange={onSearch}
      placeholder="Search"
      aria-label="Search"
      required
    />
  </form>
);
GeneralSearch.propTypes = {
  onSearch: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  searchValue: PropTypes.string.isRequired,
};

export default GeneralSearch;
