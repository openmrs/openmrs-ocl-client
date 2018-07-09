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
        <a className="dropdown-item" href="/dashboard/concepts/Organization/CIEL/CIEL">
          Add CIEL concepts
        </a>
        <a className="dropdown-item" href="/dashboard/concepts">
          Bulk add concepts
        </a>
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
        <Link className="dropdown-item" to={`${props.pathName}/new/diagnosis`}>
          Create a Diagnosis concept
        </Link>
        <Link className="dropdown-item" to={`${props.pathName}/new/symptom-finding`}>
          Create a Symptom/Finding concept
        </Link>
        <Link className="dropdown-item" to={`${props.pathName}/new/procedure`}>
          Create a Procedure concept
        </Link>
        <Link className="dropdown-item" to={`${props.pathName}/new/question`}>
          Create a Q-and-A concept
        </Link>
        <Link className="dropdown-item" to={`${props.pathName}/new/drug`}>
          Create a Drug concept
        </Link>
        <Link className="dropdown-item" to={`${props.pathName}/new/test`}>
          Create a Test concept
        </Link>
        <Link className="dropdown-item" to={`${props.pathName}/new/set`}>
          Create a Set of concept
        </Link>
        <Link className="dropdown-item" to={`${props.pathName}/new`}>
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
