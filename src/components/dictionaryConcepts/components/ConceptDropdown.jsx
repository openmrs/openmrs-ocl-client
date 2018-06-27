import React from 'react';

const ConceptDropdown = () => (
  <div className="col-12 col-md-10 concept-dropdown">
    <div className="btn-group concept-btn">
      <button
        className="btn btn-outline-dark dropdown-toggle rounded-edge disabled"
        type="button"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        Add existing concepts
      </button>
      <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <a className="dropdown-item" href="#!">
          Add CIEL concepts
        </a>
        <a className="dropdown-item" href="#!">
          Add Bahmni concepts
        </a>
        <a className="dropdown-item" href="#!">
          Bulk add concepts
        </a>
      </div>
    </div>

    <div className="btn-group concept-btn">
      <button
        className="btn btn-outline-dark dropdown-toggle rounded-edge disabled"
        type="button"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        Create new concept
      </button>
      <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <a className="dropdown-item" href="#!">
          Create a Diagnosis concept
        </a>
        <a className="dropdown-item" href="#!">
          Create a Symptom/Finding concept
        </a>
        <a className="dropdown-item" href="#!">
          Create a Procedure concept
        </a>
        <a className="dropdown-item" href="#!">
          Create a Q-and-A concept
        </a>
        <a className="dropdown-item" href="#!">
          Create a Drug concept
        </a>
        <a className="dropdown-item" href="#!">
          Create a Test concept
        </a>
        <a className="dropdown-item" href="#!">
          Create a Set of concept
        </a>
        <a className="dropdown-item" href="#!">
          Create another kind of concept
        </a>
      </div>
    </div>
  </div>
);

export default ConceptDropdown;
