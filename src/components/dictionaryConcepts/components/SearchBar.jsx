import React from 'react';
import PropTypes from 'prop-types';

const SearchBar = ({
  conceptsCount,
  totalConceptsCount,
  handleSearch,
  searchValue,
  submit,
  countStart,
  prev,
  next,
}) => {
  const displayedConcepts = conceptsCount > totalConceptsCount ? totalConceptsCount : conceptsCount;
  const togglePrevPaginationButton = !(countStart > 1);
  const toggleNextPaginationButton = !(conceptsCount > totalConceptsCount);
  return (
    <div className="row search-container">
      <div className="concept-search-wrapper col-12 col-md-5 col-sm-8">
        <i className="fa fa-search search-icons" aria-hidden="true" />
        <form action="" onSubmit={submit}>
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
      <div className="search-pagination col-12">
        <span className="paginate-count">
          {countStart} - {displayedConcepts} of {totalConceptsCount}
          <span className="paginate-controllers">
            {!togglePrevPaginationButton && (
              <i
                className="fas fa-chevron-left left-arrow"
                id="previous"
                role="presentation"
                onClick={prev}
              />
            )}
            {togglePrevPaginationButton && (
              <i
                className="fas fa-chevron-left left-arrow disabled-pagination-button"
                role="presentation"
              />
            )}
            {toggleNextPaginationButton && (
              <i className="fas fa-chevron-right" id="next" role="presentation" onClick={next} />
            )}
            {!toggleNextPaginationButton && (
              <i className="fas fa-chevron-right disabled-pagination-button" role="presentation" />
            )}
          </span>
        </span>
      </div>
    </div>
  );
};

SearchBar.propTypes = {
  conceptsCount: PropTypes.number.isRequired,
  totalConceptsCount: PropTypes.string.isRequired,
  handleSearch: PropTypes.func.isRequired,
  searchValue: PropTypes.string.isRequired,
  submit: PropTypes.func.isRequired,
  countStart: PropTypes.number.isRequired,
  prev: PropTypes.func.isRequired,
  next: PropTypes.func.isRequired,
};

export default SearchBar;
