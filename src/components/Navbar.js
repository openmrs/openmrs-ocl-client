import React from 'react';
import Login from './Login';

const Navbar = () => (
  <div>
    <nav className="navbar navbar-expand-lg navbar-light bg-light nav">
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
          <a
            className="nav-item nav-link text-white"
            data-toggle="modal"
            data-target="#signinModal"
            href="!#"
          >
            <i className="fa fa-user" />
            <strong> Sign In</strong>
          </a>
        </ul>
      </div>
    </nav>
    <div>
      <Login />
    </div>
  </div>
);
export default Navbar;
