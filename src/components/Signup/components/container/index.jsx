import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { TRADITIONAL_OCL_BASE_URL } from '../../../dictionaryConcepts/components/helperFunction';

export class Signup extends Component {
  state = {
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  };

  handleInput = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  render() {
    const {
      firstName, lastName, email, username, password, confirmPassword,
    } = this.state;
    return (
      <div className="container">
        <div className="col-md-6 m-auto">
          <h1>Open Concept Lab</h1>
          <h4>for OpenMRS</h4>
          <p>
            Use the shared Open Concept Lab to create OpenMRS dictionaries by mixing expert-defined
            content with your own custom concepts.
          </p>
          <form>
            <fieldset>
              <legend>Sign Up to Open Concept Lab</legend>
              <p className="paragraph">First Name</p>
              <input
                type="text"
                className="form-control"
                placeholder="Enter First name"
                name="firstName"
                id="firstName"
                required
                value={firstName}
                onChange={this.handleInput}
              />
              <p className="paragraph">Last Name</p>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Last name"
                name="lastName"
                id="lastname"
                required
                value={lastName}
                onChange={this.handleInput}
              />
              <p className="paragraph">Email</p>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your Email"
                name="email"
                id="email"
                required
                value={email}
                onChange={this.handleInput}
              />
              <p className="paragraph">Username</p>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Username"
                name="username"
                id="userName"
                required
                value={username}
                onChange={this.handleInput}
              />
              <p className="paragraph">Password</p>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Enter Password"
                name="password"
                required
                value={password}
                onChange={this.handleInput}
              />
              <div className="form-group">
                <p className="paragraph"> Confirm Password</p>
                <input
                  type="confirmPassword"
                  id="confirmpassword"
                  className="form-control"
                  placeholder="Confirm Password"
                  name="confirmpassword"
                  required
                  value={confirmPassword}
                  onChange={this.handleInput}
                />
              </div>
              <div className="row">
                <div className="col-md-6">
                  <button type="button" className="btn btn-primary btn-block login-button">
                    Sign Up
                  </button>
                </div>
                <div className="col-md-6">
                  <div className="form-group ">
                    Have an account already?
                    <Link to="/"> Login</Link>
                  </div>
                </div>
              </div>
            </fieldset>
            <div className="container text-right pt-3">
              Or Sign Up on
              {' '}
              <a href={`${TRADITIONAL_OCL_BASE_URL}/accounts/signup/`}>Traditional OCL</a>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default connect(Signup);
