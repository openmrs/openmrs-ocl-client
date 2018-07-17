import React, { Component } from 'react';
import Notification, { notify } from 'react-notify-toast';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logoutAction } from '../redux/actions/auth/authActions';
import GeneralSearch from './GeneralSearch/NavbarGeneralSearch';
import { searchDictionaries, fetchDictionaries } from '../redux/actions/dictionaries/dictionaryActionCreators';
import generalSearch from '../redux/actions/GeneralSearchActions/generalSearchActionCreators';

export class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInput: '',
    };
  }

  onSubmit = (event) => {
    event.preventDefault();
    const { searchInput } = this.state;
    this.props.generalSearch(searchInput);
    this.props.history.push(`/search/${searchInput}`);
  }

  onSearch = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value,
    });
  }
  logoutUser = (event) => {
    event.preventDefault();
    this.props.logoutAction();
    this.props.history.push('/');
    notify.show('You Loggedout successfully', 'success', 3000);
  };
  render() {
    const { searchInput } = this.state;
    return (
      <div>
        <Notification options={{ zIndex: 10000, top: '200px' }} />
        <nav className="navbar navbar-expand-lg fixed-top navbar-light bg-light nav">
          <strong>
            <a className="navbar-brand" href="/">
              OCL for OpenMRS
            </a>
          </strong>
          {this.props.loggedIn && (
          <GeneralSearch
            onSearch={this.onSearch}
            onSubmit={this.onSubmit}
            searchValue={searchInput}
          />
          )}
          <div className="collapse navbar-collapse " id="navbarNav">
            {this.props.loggedIn && (
              <ul className="navbar-nav ml-auto" id="navList">
                <div className="navBarItems">
                  <li className="nav-item nav-link dropdown" id="navbarDropdown">
                    <a
                      className="nav-link text-white"
                      href="/dashboard/dictionaries"
                      id="navbarDropdown"
                      role="button"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <strong>
                        Dictionaries
                      </strong>
                    </a>
                  </li>
                  <li className="nav-item nav-link dropdown" id="navbarItemSource">
                    <a
                      className="nav-link text-white"
                      href="/dashboard/sources"
                      role="button"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <strong>
                        Sources
                      </strong>
                    </a>
                  </li>
                  <li className="nav-item nav-link dropdown" id="navbarDropdown">
                    <a
                      className="nav-link text-white"
                      href="/dashboard/concepts"
                      role="button"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <strong>
                      Concepts
                      </strong>
                    </a>
                  </li>
                </div>
                <li className="nav-item nav-link dropdown" id="navbarUser">
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
  generalSearch: PropTypes.func.isRequired,
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
    searchDictionaries,
    fetchDictionaries,
    generalSearch,
  },
)(withRouter(Navbar));
