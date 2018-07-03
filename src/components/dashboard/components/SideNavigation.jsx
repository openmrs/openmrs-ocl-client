import React from 'react';
import { NavLink } from 'react-router-dom';
import AddDictionary from './dictionary/AddDictionary';

class SideNavigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
  }

  handleHide = () => this.setState({ show: false });

  handleShow = () => this.setState({ show: true });
  render() {
    return (
      <div className="side-nav d-none d-md-block d-lg-block">
        <ul className="nav flex-column">
          <li className="nav-item">
            <a className="nav-link active" onClick={this.handleShow}>
          Add Dictionary
            </a>
          </li>
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
        <AddDictionary show={this.state.show} handleHide={this.handleHide} />
      </div>
    );
  }
}
export default SideNavigation;
