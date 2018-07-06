import React from 'react';
import { NavLink } from 'react-router-dom';

class SideNavigation extends React.Component {
  render() {
    return (
      <div className="side-nav d-none d-md-block d-lg-block">
        <ul className="nav flex-column">
          <li className="nav-item">
            <NavLink to="/dashboard/dictionaries" className="nav-link" activeClassName="activeStyle">
            Dictionaries
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/dashboard/sources" className="nav-link" activeClassName="activeStyle">
            Sources
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/dashboard/concepts" className="nav-link" activeClassName="activeStyle">
              Concepts
            </NavLink>
          </li>
        </ul>

      </div>
    );
  }
}
export default SideNavigation;
