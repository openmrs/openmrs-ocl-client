import React from 'react';

/* eslint-disable */
const GeneralSearch = ({ onSearch, onSubmit, searchValue }) => {
  return (
    <form className="form-inline" id="generalSearchForm">
      <input 
      class="form-control mr-sm-2"
      id="generalSearch"
      type="search" 
      placeholder="Search" 
      aria-label="Search" />
    </form>
  )
};

export default GeneralSearch;
