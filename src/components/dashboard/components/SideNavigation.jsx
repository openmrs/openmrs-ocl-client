import React from 'react';
import { Link } from 'react-router-dom';

const SideNavigation = () => (
  <div className="side-nav d-none d-md-block d-lg-block">
    <ul className="nav flex-column">
      <li className="nav-item">
        <Link to="/dashboard" className="nav-link active">
          Sources
        </Link>
        <Link to="/dashboard/concepts" className="nav-link active">
          <i className="fa fa-tags" /> Concepts
        </Link>
      </li>
    </ul>
  </div>
);
export default SideNavigation;
