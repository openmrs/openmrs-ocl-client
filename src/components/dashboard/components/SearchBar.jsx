import React from 'react';

/* eslint-disable */
const SearchBar = ({ onSearch, onSubmit, searchValue }) => {
  return (
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
              className="search-bar col-8 col-sm-8 col-md-7 col-lg-8"
              placeholder="Search for a source"
            />
            <div className="dropdown d-inline d-md-none col-1 mini-source-btn">
              <a
                className="dropdown-toggle"
                href="#"
                role="button"
                id="sources"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                data-tip="sources"
              >
                <i className="fas fa-list fa-fw" />
              </a>

              <div className="dropdown-menu" aria-labelledby="sources">
                <a className="dropdown-item" href="#">
                  Sources
                </a>
              </div>
            </div>
            <div className="dropdown d-none d-md-inline d-lg-inline d-xl-inline mini-sort-btn col-md-2">
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
