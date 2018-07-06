import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'react-tooltip';

export const DictionariesSearch = ({ onSearch, onSubmit, searchValue }) => (
  <div className="container-fluid dictionary-search">
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
            placeholder="Search in all OpenMRS dictionaries"
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
                Dictionaries
              </a>
            </div>
          </div>
          <div className="search-filter">
            <div className="dropdown d-none d-md-inline d-lg-inline d-xl-inline mini-sort-btn col-md-2">
              <a
                className="dropdown-toggle"
                href="#!"
                role="button"
                id="dictionaryResults"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Filter Dictionaries View
              </a>
              <div
                className="dropdown-menu source-menu"
                aria-labelledby="dictionaryResults"
              >
                <div className="form-check ml-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="organizations"
                    id="organizations"
                    onChange={onSearch}
                  />
                  <label className="form-check-label" htmlFor="organizations">
                    All OpenMRS Dictionaries
                  </label>
                </div>
                <div className="form-check ml-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="user"
                    id="user"
                    onChange={onSearch}
                  />
                  <label className="form-check-label" htmlFor="user">
                    Your Dictionaries
                  </label>
                </div>
                <div className="form-check p-1">
                  <a
                    href="#!"
                    className="btn btn-sm btn-block btn-secondary no-shadow text-white"
                    onClick={onSubmit}
                    id="filterdictionaries"
                  >
                    filter results
                  </a>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
    <Tooltip place="bottom" type="dark" effect="float" />
  </div>
);
DictionariesSearch.propTypes = {
  onSearch: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  searchValue: PropTypes.string.isRequired,
};
export default DictionariesSearch;
