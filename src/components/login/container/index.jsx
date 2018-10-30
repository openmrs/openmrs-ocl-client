import React, { Component } from 'react';
import { notify } from 'react-notify-toast';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import Title from '../../Title';
import { loginAction } from '../../../redux/actions/auth/authActions';
import SubmitButton from '../components/SubmitButton';

export class Login extends Component {
  state = {
    password: '',
    username: '',
  };

  handleInput = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleLogin = (event) => {
    event.preventDefault();
    const { username, password } = this.state;
    this.props.loginAction({ username, password });
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { payload, loggedIn, loading } = nextProps;
    const { push } = this.props.history;
    if (loading) return;

    if (loggedIn) {
      notify.show(`Logged in successfully as ${this.state.username}`, 'success', 3000);
      push('/home');
      return;
    }

    if (payload && payload.errorMessage) {
      notify.show(payload.errorMessage, 'error', 3000);
    }
  }

  render() {
    const { username, password } = this.state;
    const { loading } = this.props;
    const buttonTitle = loading ? 'Logging in...' : 'Log in';
    return (
      <div className="container">
        <Title title="Login" />
        <div className="row form-container">
          <div className="col-lg-5 col-md-9 col-sm-12">
            <h1 className="login-title">Open Concept Lab</h1>
            <h4 className="low-title">for OpenMRS</h4>
            <h6 className="low-title-msg">
              Use the shared Open Concept Lab to create OpenMRS dictionaries by mixing
              expert-defined content with your own custom concepts.
            </h6>
            <form className="form-wrapper" onSubmit={this.handleLogin}>
              <fieldset>
                <legend>Log In to Open Concept Lab</legend>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="OCL Username"
                    name="username"
                    id="username"
                    required
                    value={username.trim()}
                    onChange={this.handleInput}
                  />

                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    placeholder="OCL Password"
                    name="password"
                    required
                    value={password.trim()}
                    onChange={this.handleInput}
                  />

                </div>
                <SubmitButton buttonTitle={buttonTitle} disable={loading} />
                <div className="form-group text-center pt-3">
                  <small id="tokenHelp" className="form-text text-muted">
                    {"Don't"}
                    {' '}
have an account?
                    {' '}
                    <a
                      href="https://qa.openconceptlab.org/accounts/signup/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                    Sign up
                    </a>
                    <br />
                    <a
                      href="https://qa.openconceptlab.org"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                    Go to Traditional OCL
                    </a>
                    <br />
                    <Link to="/loginDetails">Having Trouble with Login?</Link>
                  </small>

                </div>
              </fieldset>
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
