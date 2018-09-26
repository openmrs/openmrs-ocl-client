import React, { Component } from 'react';
import Notification, { notify } from 'react-notify-toast';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logoutAction } from '../redux/actions/auth/authActions';

export class Navbar extends Component {
  logoutUser = (event) => {
    event.preventDefault();
    this.props.logoutAction();
    this.props.history.push('/');
    notify.show('You Loggedout successfully', 'success', 3000);
  };
  render() {
    return (
      <div>
        <Notification options={{ zIndex: 10000, top: '200px' }} />
        <nav className="navbar navbar-expand-lg navbar-light bg-dark">
          <strong>
            <a className="navbar-brand" href="/">
              OCL for OpenMRS
            </a>
          </strong>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarA"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse " id="navbarA">
            {this.props.loggedIn && (
              <ul className="navbar-nav ml-auto" id="navList">
                <li className="nav-item nav-link" >
                  <a
                    className="nav-link text-white"
                    href="/home"
                  >
                    <strong>
                      Home
                    </strong>
                  </a>
                </li>
                <li className="nav-item nav-link" >
                  <a
                    className="nav-link text-white"
                    href="/dashboard/dictionaries"
                  >
                    <strong>
                      All Dictionaries
                    </strong>
                  </a>
                </li>
                <li className="nav-item nav-link" >
                  <a
                    className="nav-link text-white"
                    href="/dashboard/sources"
                  >
                    <strong>
                      Sources
                    </strong>
                  </a>
                </li>
                <li className="nav-item nav-link">
                  <a
                    className="nav-link text-white"
                    href="/dashboard/concepts"
                  >
                    <strong>
                    Concepts
                    </strong>
                  </a>
                </li>
                <li className="nav-item nav-link dropdown">
                  <a
                    className="nav-link dropdown-toggle text-white"
                    href="!#"
                    id="navbarDropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <i className="fa fa-user" />
                    <strong>
                      {''} {localStorage.getItem('username') || this.props.user.username} {''}{' '}
                    </strong>
                  </a>
                  <div className="dropdown-menu" aria-labelledby="navbarDropdown" id="navbarDropdown">
                    <a className="dropdown-item nav-link" href="!#" onClick={this.logoutUser}>
                      <strong>
                        Logout <i className="fa fa-sign-out" />
                      </strong>
                    </a>
                  </div>
                </li>
              </ul>
            )}
          </div>
        </nav>
      </div>
    );
  }
}

Navbar.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  user: PropTypes.shape({ username: PropTypes.string }),
  logoutAction: PropTypes.func.isRequired,
  history: PropTypes.shape({ url: PropTypes.string, push: PropTypes.func }).isRequired,
};

Navbar.defaultProps = {
  user: {},
};

const mapStateToProps = state => ({
  loggedIn: state.users.loggedIn,
  user: state.users.payload,
  payload: state.users.payload,
});

export default connect(
  mapStateToProps,
  {
    logoutAction,
  },
)(withRouter(Navbar));
