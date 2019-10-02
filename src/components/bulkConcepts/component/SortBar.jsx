import React from 'react';
import PropTypes from 'prop-types';

const SortBar = (
  {
    sortCriteria,
    setSortCriteria,
    sortDirection,
    setSortDirection,
    sortOptions,
  },
) => (
  <div className="col-6" id="sort-bar">
    <span className="label">Sort by:</span>
    <select name="sort-bar-criteria" value={sortCriteria} className="custom-select" onChange={event => setSortCriteria(event.target.value)}>
      {
        sortOptions.map(([value, text]) => (
          <option
            key={value}
            value={value}
          >
            {text}
          </option>
        ))
      }
    </select>
    <select name="sort-bar-direction" value={sortDirection} className="custom-select" onChange={event => setSortDirection(event.target.value)}>
      <option value="sortAsc">Ascending</option>
      <option value="sortDesc">Descending</option>
    </select>
  </div>
);

SortBar.propTypes = {
  setSortCriteria: PropTypes.func.isRequired,
  sortCriteria: PropTypes.string.isRequired,
  setSortDirection: PropTypes.func.isRequired,
  sortDirection: PropTypes.string.isRequired,
  sortOptions: PropTypes.array,
};

SortBar.defaultProps = {
  sortOptions: [
    ['lastUpdate', 'Last update'], ['name', 'Name'], ['id', 'ID'], ['bestMatch', 'Best match'],
  ],
};

export default SortBar;
