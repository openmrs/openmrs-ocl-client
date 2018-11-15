import React, { Component } from 'react';
import Notification, { notify } from 'react-notify-toast';
import { withRouter, Link } from 'react-router-dom';
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
      <div className="custom-bg-dark">
        <Notification options={{ zIndex: 10000, top: '200px' }} />
        <nav className="navbar navbar-expand-lg navbar-light bg-dark custom-max-width">
          <a className="nav-link navbar-brand" href="/">
              OCL for OpenMRS
          </a>
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
                <li className="nav-item nav-link">
                  <Link
                    className="nav-link text-white"
                    to="/home"
                  >
                      Home
                  </Link>
                </li>
                <li className="nav-item nav-link">
                  <Link
                    className="nav-link text-white"
                    to="/dashboard/dictionaries"
                  >
                      All Dictionaries
                  </Link>
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
                    <span className="fa fa-user" />
                    {' '}
                    {localStorage.getItem('username') || this.props.user.username}
                    {' '}
                  </a>
                  <div
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdown"
                    id="navbarDropdown"
                  >
                    <button
                      type="submit"
                      className="dropdown-item nav-link"
                      onClick={this.logoutUser}
                    >
                      <strong>
                        Logout
                        {' '}
                        <i className="fa fa-sign-out" />
                      </strong>
                    </button>
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
