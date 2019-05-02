import React from 'react';
import { Link } from 'react-router-dom';
import { TRADITIONAL_OCL_HOST } from '../../dictionaryConcepts/components/helperFunction';

const LoginDetails = () => (
  <div className=" container login-details">
    <div className="card">
      <div className="card-header">
        <strong>Help</strong>
      </div>
      <div className="card-body">
        Ensure you have an account or
        {' '}
        <a href={`${TRADITIONAL_OCL_HOST}/accounts/signup/`}>
          sign up here
        </a>
        <br />
        After signing up, check the email address you used during sign up for the
        confirmation email.
        <br />
        To activate your account, please follow the link in the
        confirmation email to confirm your email address.
      </div>
      <Link to="/">Ready to Login now?</Link>
    </div>
  </div>
);
export default LoginDetails;
