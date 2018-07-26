import React, { Component } from 'react';
import { notify } from 'react-notify-toast';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { loginAction } from '../../../redux/actions/auth/authActions';
import SubmitButton from '../components/SubmitButton';
import '../styles/index.css';

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

    if (payload && payload.errorMessage) {
      notify.show(payload.errorMessage, 'error', 3000);
    }
  }

  render() {
    const { username, token } = this.state;
    const { loading } = this.props;
    const buttonTitle = loading ? 'Signing in...' : 'Sign in';
    return (
      <div className="container">
        <div className="row form-container">
          <div className="col-lg-5 col-md-9 col-sm-12">
            <form className="form-wrapper" onSubmit={this.handleLogin}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="OCL username"
                  name="username"
                  id="username"
                  required
                  value={username.trim()}
                  onChange={this.handleInput}
                />
              </div>
              <div className="form-group">
                <label htmlFor="token">Token</label>
                <input
                  type="text"
                  id="token"
                  className="form-control"
                  placeholder="OCL token"
                  name="token"
                  required
                  value={token.trim()}
                  onChange={this.handleInput}
                />
                <small id="tokenHelp" className="form-text text-muted">
                  Copy your token from the{' '}
                  <a href="https://qa.openconceptlab.org/" target="_blank" rel="noopener noreferrer">
                    traditional ocl
                  </a>
                </small>
              </div>
              <SubmitButton buttonTitle={buttonTitle} disable={loading} />
              <div className="form-group text-center pt-3">
                <small id="tokenHelp" className="form-text text-muted">
                  {"Don't"} have an account?{' '}
                  <a
                    href="https://qa.openconceptlab.org/accounts/signup/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Sign up
                  </a><br />
                  <Link to="/loginDetails" >Having Trouble with Login?</Link>
                </small>

              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  loginAction: PropTypes.func.isRequired,
  history: PropTypes.shape({ url: PropTypes.string, push: PropTypes.func }).isRequired,
  loading: PropTypes.bool,
};

Login.defaultProps = {
  loading: false,
};

const mapStateToProps = state => ({
  loggedIn: state.users.loggedIn,
  payload: state.users.payload,
  loading: state.users.loading,
});

export default connect(
  mapStateToProps,
  { loginAction },
)(withRouter(Login));
