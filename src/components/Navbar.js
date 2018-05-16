import React from 'react';
import { connect } from 'react-redux';
import Login from './Login';

const Navbar = props => (
  <div>
    <nav className="navbar navbar-expand-lg nav">
      <strong>
        <a className="navbar-brand" href="/">
          OCL for OpenMRS
        </a>
      </strong>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse " id="navbarNav">
        <ul className="navbar-nav ml-auto">
        { props.loggedIn ?
            <a
              className="nav-item nav-link text-white"
              href="!#"
            >
              <strong>{''} { localStorage.getItem('username') || props.user.username } {''} </strong>
            </a> :
            <a
              className="nav-item nav-link text-white"
              data-toggle="modal"
              data-target="#signinModal"
              href="!#"
            >
              <i className="fa fa-user" />
              <strong> Sign In</strong>
            </a>
          }
        </ul>
      </div>
    </nav>
    <div>
      <Login />
    </div>
  </div>
);
const mapStateToProps = state => ({
  loggedIn: state.users.loggedIn,
  user: state.users.payload,
});

export default connect(mapStateToProps)(Navbar);
