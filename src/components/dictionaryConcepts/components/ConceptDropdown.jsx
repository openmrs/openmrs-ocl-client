import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap';

const ConceptDropdown = props => (
  <div className="col-12 col-md-10 concept-dropdown">
    <div className="btn-group concept-btn">
      <UncontrolledDropdown>
        <DropdownToggle className="rounded-edge" caret>
      Add existing concepts
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem>
            <Link className="dropdown-item" to={`/import${props.pathName}`}>
          Add CIEL concepts
            </Link>
          </DropdownItem>
          <DropdownItem>
            <Link to={`/bulk${props.pathName}`} className="dropdown-item">
          Bulk add concepts
            </Link>
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    </div>

    <div className="btn-group concept-btn">
      <UncontrolledDropdown>
        <DropdownToggle className="rounded-edge" caret>
        Create new concept
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem>
            <Link className="dropdown-item" to={`/new/diagnosis${props.pathName}`}>
          Create a Diagnosis concept
            </Link>
          </DropdownItem>
          <DropdownItem>
            <Link className="dropdown-item" to={`/new/symptom-finding${props.pathName}`}>
          Create a Symptom/Finding concept
            </Link>
          </DropdownItem>
          <DropdownItem>
            <Link className="dropdown-item" to={`/new/procedure${props.pathName}`}>
          Create a Procedure concept
            </Link>
          </DropdownItem>
          <DropdownItem>
            <Link className="dropdown-item" to={`/new/question${props.pathName}`}>
          Create a Q-and-A concept
            </Link>
          </DropdownItem>
          <DropdownItem>
            <Link className="dropdown-item" to={`/new/drug${props.pathName}`}>
          Create a Drug concept
            </Link>
          </DropdownItem>
          <DropdownItem>
            <Link className="dropdown-item" to={`/new/test${props.pathName}`}>
          Create a Test concept
            </Link>
          </DropdownItem>
          <DropdownItem>
            <Link className="dropdown-item" to={`/new/set${props.pathName}`}>
          Create a set of concepts
            </Link>
          </DropdownItem>
          <DropdownItem>
            <Link className="dropdown-item" to={`/new${props.pathName}`}>
          Create another kind of concept
            </Link>
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    </div>
  </div>
);
ConceptDropdown.propTypes = {
  pathName: PropTypes.string.isRequired,
};
export default ConceptDropdown;
