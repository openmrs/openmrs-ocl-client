import React, { Component } from 'react';
import { notify } from 'react-notify-toast';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import LoginAction from '../Actions/AuthActions';


export class Login extends Component {
  state = {
    username: '',
    token: '',
  };

  handleInput = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleLogin = (event) => {
    event.preventDefault();
    const { username, token } = this.state;
    this.props.LoginAction({ username, token });
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { payload, loggedIn } = nextProps;
    if (loggedIn) {
      notify.show('loggedin successfully', 'success', 3000);
      document.getElementById('CloseLoginModal').click();
      this.props.history.push('/dashboard');
      return;
    }

    if (payload.errorMessage) {
      notify.show(payload.errorMessage, 'error', 3000);
    }
  }

  render() {
    const { username, token } = this.state;

    return (
      <div>
        <div>
          <div
            className="modal fade"
            id="signinModal"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="signin-modal-label"
            aria-hidden="true"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className="modal-title " id="signin-modal-label">
                    Login
                  </h3>

                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                    id="CloseLoginModal"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
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
                      <button
                        type="submit"
                        className="btn btn-primary form-control"
                      >
                        Sign In
                      </button>
                    </div>
                  </form>
                  <div className="text-center">
                    <a href="https://openconceptlab.org/accounts/password/reset/">
                      Forgot password?
                    </a>
                  </div>
                  <div className="modal-footer text-center">
                    New User?{' '}
                    <a href="https://openconceptlab.org/accounts/signup/">
                      Create account
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
Login.propTypes = {
  LoginAction: PropTypes.shape({ username: PropTypes.string, token: PropTypes.string }),
  history: PropTypes.shape({ url: PropTypes.string, push: PropTypes.func }),

};

Login.defaultProps = {
  LoginAction: {},
  history: {},
};

const mapStateToProps = state => ({
  loggedIn: state.users.loggedIn,
  payload: state.users.payload,
});

export default connect(mapStateToProps, { LoginAction })(withRouter(Login));
