import React from 'react';
import AddDictionary from './dictionary/AddDictionary';
import { Link }from 'react-router-dom';
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
        <a href="/dashboard/concepts" className="nav-link active">
              <i className="fa fa-tags" /> Concepts
          </a>
          </li>
        <li className="nav-item">
          <Link className="nav-link active" to="/dashboard/dictionaries">
            Dictionaries
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link active" to="/dashboard">
            Sources
          </Link>
        </li>
        </ul>
        <AddDictionary show={this.state.show} handleHide={this.handleHide} />
      </div>
    );
  }
}
export default SideNavigation;
