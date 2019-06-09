import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { notify } from 'react-notify-toast';
import history from '../../config/history';

export const checkAuth = (event) => {
  if (event.key === null) {
    const token = localStorage.getItem('token');
    if (!token) {
      notify.show('You have been logged out', 'warning', 3000);
      history.go(0);
    }
  }
  if (event.key === 'token') {
    const token = localStorage.getItem('token');
    if (token) {
      notify.show('Logged in successfully', 'success', 3000);
      history.go(0);
    }
  }
};

export const AuthWrapper = (WrappedComponent) => {
  window.addEventListener('storage', event => checkAuth(event));
  class Authenticate extends Component {
    static propTypes = {
      loggedIn: PropTypes.bool,
      history: PropTypes.shape({
        push: PropTypes.func,
      }).isRequired,
      location: PropTypes.shape({
        pathname: PropTypes.string,
      }).isRequired,
    };

    static defaultProps = {
      loggedIn: false,
    };

    componentWillMount() {
      const { push } = this.props.history;
      if (!this.props.loggedIn) {
        push('/');
        return;
      }
      if (this.props.location.pathname === '/') {
        push('/home');
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return Authenticate;
};

export const mapStateToProps = ({ users: { loggedIn } }) => ({
  loggedIn,
});

export default Authenticate => connect(mapStateToProps)(AuthWrapper(Authenticate));
