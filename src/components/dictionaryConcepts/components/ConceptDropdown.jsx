import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const ConceptDropdown = props => (
  <div className="col-12 col-md-10 concept-dropdown">
    <div className="btn-group concept-btn">
      <button
        className="btn btn-outline-dark dropdown-toggle rounded-edge"
        type="button"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        Add existing concepts
      </button>
      <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <Link className="dropdown-item" to={`/import${props.pathName}`}>
          Add CIEL concepts
        </Link>
        <Link to={`/bulk${props.pathName}`} className="dropdown-item">
          Bulk add concepts
        </Link>
      </div>
    </div>

    <div className="btn-group concept-btn">
      <button
        className="btn btn-outline-dark dropdown-toggle rounded-edge"
        type="button"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        Create new concept
      </button>
      <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <Link className="dropdown-item" to={`/new/diagnosis${props.pathName}`}>
          Create a Diagnosis concept
        </Link>
        <Link className="dropdown-item" to={`/new/symptom-finding${props.pathName}`}>
          Create a Symptom/Finding concept
        </Link>
        <Link className="dropdown-item" to={`/new/procedure${props.pathName}`}>
          Create a Procedure concept
        </Link>
        <Link className="dropdown-item" to={`/new/question${props.pathName}`}>
          Create a Q-and-A concept
        </Link>
        <Link className="dropdown-item" to={`/new/drug${props.pathName}`}>
          Create a Drug concept
        </Link>
        <Link className="dropdown-item" to={`/new/test${props.pathName}`}>
          Create a Test concept
        </Link>
        <Link className="dropdown-item" to={`/new/set${props.pathName}`}>
          Create a Set of concept
        </Link>
        <Link className="dropdown-item" to={`/new${props.pathName}`}>
          Create another kind of concept
        </Link>
      </div>
    </div>
  </div>
);
ConceptDropdown.propTypes = {
  pathName: PropTypes.string.isRequired,
};
export default ConceptDropdown;
