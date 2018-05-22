import React, { Component } from 'react';
import { notify } from 'react-notify-toast';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { LogoutAction } from '../Actions/AuthActions';

class Navbar extends Component {
  logoutUser = event => {
    event.preventDefault();
    this.props.LogoutAction();
    this.props.history.push('/');
    notify.show('You Loggedout successfully', 'success', 3000);
  };
  render() {
    return (
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
            {this.props.loggedIn && (
              <ul className="navbar-nav ml-auto">
                <li class="nav-item nav-link dropdown">
                  <a
                    class="nav-link dropdown-toggle text-white"
                    href="!#"
                    id="navbarDropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <i className="fa fa-user" />
                    <strong>
                      {''}{' '}
                      {localStorage.getItem('username') ||
                        this.props.user.username}{' '}
                      {''}{' '}
                    </strong>
                  </a>
                  <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                    <a
                      class="dropdown-item nav-link"
                      href="!#"
                      onClick={this.logoutUser}
                    >
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

const mapStateToProps = state => ({
  loggedIn: state.users.loggedIn,
  user: state.users.payload,
  payload: state.users.payload,
});

export default connect(mapStateToProps, { LogoutAction })(withRouter(Navbar));
