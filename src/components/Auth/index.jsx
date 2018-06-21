import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

export const mapStateToProps = ({ users: { loggedIn } }) => ({
  loggedIn,
});

export const AuthWrapper = (WrappedComponent) => {
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
      if (!this.props.loggedIn) {
        this.props.history.push('/');
        return;
      }
      if (this.props.location.pathname === '/') {
        this.props.history.push('/dashboard');
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return Authenticate;
};

export default Authenticate => connect(mapStateToProps, null)(AuthWrapper(Authenticate));
