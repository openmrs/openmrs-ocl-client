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

export default Authenticate => connect(mapStateToProps, null)(AuthWrapper(Authenticate));
