import React from 'react';

/* eslint-disable */
const SearchBar = ({ onSearch, onSubmit, searchValue }) => {
  return (
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
            placeholder="Search for a source"
          />
        </form>
      </div>
      <div className="col-0" />
      <div className="concept-search-wrapper dropdown d-none d-md-inline d-lg-inline d-xl-inline mini-sort-btn col-md-2">
        <a
          className="dropdown-toggle"
          href="#"
          role="button"
          id="sourceType"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          Filter by source type
          </a>
        <div className="dropdown-menu source-menu" aria-labelledby="sourceType">
          <div className="form-check ml-3">
            <input
              className="form-check-input"
              type="checkbox"
              name="dictionary"
              id="dictionary"
              onChange={onSearch}
            />
            <label className="form-check-label" htmlFor="dictionary">
              Dictionary
              </label>
          </div>
          <div className="form-check ml-3">
            <input
              className="form-check-input"
              type="checkbox"
              name="external"
              onChange={onSearch}
              id="external"
            />
            <label className="form-check-label" htmlFor="external">
              External
              </label>
          </div>
          <div className="form-check ml-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="indicator"
              name="indicatorRegistry"
              onChange={onSearch}
            />
            <label className="form-check-label" htmlFor="indicator">
              Indicator Registry
              </label>
          </div>
          <div className="form-check ml-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="interface"
              name="interfaceTerminology"
              onChange={onSearch}
            />
            <label className="form-check-label" htmlFor="interface">
              Interface Terminology
              </label>
          </div>
          <div className="form-check p-1">
            <a
              href="#!"
              className="btn btn-sm btn-block btn-primary no-shadow text-white"
              onClick={onSubmit}
            >
              filter result
              </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
