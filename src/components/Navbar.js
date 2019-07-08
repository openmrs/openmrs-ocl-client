import React, { Component } from 'react';
import Notification, { notify } from 'react-notify-toast';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Collapse,
  Navbar as Navigation,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { logoutAction } from '../redux/actions/auth/authActions';

export class Navbar extends Component {
    state = {
      isOpen: false,
    };

  logoutUser = (event) => {
    event.preventDefault();
    this.props.logoutAction();
    this.props.history.push('/');
    notify.show('You Logged out successfully', 'success', 3000);
  };

  toggle = () => {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen,
    }));
  }

  render() {
    const { isOpen } = this.state;
    const { loggedIn } = this.props;
    return (
      <div className="custom-bg-dark">
        <Notification
          options={
            {
              zIndex: 10000,
              top: '200px',
              colors: {
                error: {
                  color: '#ffffff',
                  backgroundColor: '#e16262',
                },
                success: {
                  color: '#ffffff',
                  backgroundColor: '#009384',
                },
                warning: {
                  color: '#ffffff',
                  backgroundColor: '#6c757d',
                },
              },
            }
          }
        />
        <Navigation color="light" light expand="xl" className="custom-max-width">
          <NavbarBrand href="/">OCL for OpenMRS</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          {
          loggedIn && (
            <Collapse isOpen={isOpen} navbar>
              <Nav className="ml-auto" navbar expand="xl">
                <NavItem>
                  <Link className="nav-link text-white" to="/home">Home</Link>
                </NavItem>
                <NavItem>
                  <Link className="nav-link text-white" to="/dashboard/dictionaries">All Dictionaries</Link>
                </NavItem>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret className="text-white">
                    {localStorage.getItem('username') || this.props.user.username}
                    &nbsp;
                    <span className="fa fa-user" />
                  </DropdownToggle>
                  <DropdownMenu className="text-center" right>
                    <DropdownItem
                      type="submit"
                      className="dropdown-item nav-link"
                      onClick={this.logoutUser}
                      id="logout-user"
                    >
                      <span>
                      Logout
                        {' '}
                        <i className="fa fa-sign-out-alt" />
                      </span>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </Nav>
            </Collapse>
          )
            }
        </Navigation>
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
