import React, { Component } from 'react';
import { notify } from 'react-notify-toast';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Loader from './Loader';
import { loginAction } from '../redux/actions/auth/authActions';


export class Login extends Component {
  state = {
    token: '',
    username: '',


  };

  handleInput = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleLogin = (event) => {
    event.preventDefault();
    const { username, token } = this.state;
    this.props.loginAction({ username, token });
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { payload, loggedIn, loading } = nextProps;
    if (loading) return;

    if (loggedIn) {
      notify.show(`loggedin successfully as ${this.state.username}`, 'success', 3000);
      this.props.history.push('/dashboard');
      return;
    }

    if (payload.errorMessage) {
      notify.show(payload.errorMessage, 'error', 3000);
    }
  }

  render() {
    const { username, token } = this.state;
    const { loading } = this.props;

    return (
      <div className="signinModal">
        <div className="modal-dialog" role="document">
          <div className="modal-content ">
            <div className="modal-header">
              <h3 className="modal-title">
                <strong>Login</strong>
              </h3>
            </div>
            <div className="modal-body">
              <form onSubmit={this.handleLogin}>
                <div className="form-group">
                  <strong>
                    <label className="label" htmlFor="username">Username</label>
                  </strong>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="username"
                    name="username"
                    id="username"
                    value={username}
                    onChange={this.handleInput}
                  />
                </div>
                <div className="form-group">
                  <strong>
                    <label className="label" htmlFor="token">API Token</label>
                  </strong>
                  <input
                    id="token"
                    type="text"
                    className="form-control"
                    placeholder="token"
                    name="token"
                    value={token}
                    onChange={this.handleInput}
                  />
                </div>
                <div className="form-group">
                  {loading ? <Loader /> : <button
                    type="submit"
                    className="btn btn-login form-control"
                  >
                    <strong>Sign In</strong>
                  </button>}
                </div>
              </form>
              <div className="text-center">
                <a href="https://openconceptlab.org/accounts/password/reset/">
                      Forgot password?
                </a>
              </div>
              <div className="modal-footer text-center">
                <span>New User?</span>
                <a href="https://openconceptlab.org/accounts/signup/">
                      Create account
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
Login.propTypes = {
  loginAction: PropTypes.func.isRequired,
  history: PropTypes.shape({ url: PropTypes.string, push: PropTypes.func }).isRequired,
  loading: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  loggedIn: state.users.loggedIn,
  payload: state.users.payload,
  loading: state.users.loading,
});

export default connect(mapStateToProps, { loginAction })(withRouter(Login));
