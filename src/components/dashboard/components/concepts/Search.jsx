import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'react-tooltip';

const SearchConcepts = ({ onSearch, onSubmit, searchValue }) => (
  <div className="container-fluid">
    <div className="row justify-content-center">
      <div className="col-1" />
      <div className="col-sm-12 col-md-10  mt-2 col-12">
        <form className="search-bar-wrapper" onSubmit={onSubmit}>
          <i className="fas fa-search fa-fw mr-1 col-1" />
          <input
            type="search"
            name="searchInput"
            id="search"
            value={searchValue}
            onChange={onSearch}
            className="search-bar col-5 col-sm-7 col-md-6 col-lg-7"
            placeholder="Search for concepts"
          />
          <div className="dropdown d-inline d-md-none col-1 mini-source-btn">
            <a
              className="dropdown-toggle"
              href="!#"
              role="button"
              id="concepts"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              data-tip="concepts"
            >
              <i className="fas fa-list fa-fw" />
            </a>

            <div className="dropdown-menu" aria-labelledby="concepts">
              <a className="dropdown-item" href="!#">
                Concepts
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
    <Tooltip place="bottom" type="dark" effect="float" />
  </div>
);
SearchConcepts.propTypes = {
  onSearch: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  searchValue: PropTypes.string.isRequired,

};
export default SearchConcepts;
