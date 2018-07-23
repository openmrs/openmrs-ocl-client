import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/index.css';
import newVideo from '../styles/video/newInstructions.mp4';
import config from '../../../config';

const LoginDetails = () => (
  <div className=" container login-details">
    <div className="card">
      <div className="card-header">
        <strong>What to ensure</strong>
      </div>
      <div className="card-body">
        Ensure you have an account from the traditional OCL. After that,{' '}
        <a
          href={`${config.traditionalOCL}/accounts/login/`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Login into the traditional OCL
        </a>
        <br />
        After you have logged in, you will see a user dashboard page with your API token in the left
        corner. Then use it to Login to the OCL for OpenMRS
      </div>
      <div className="card-header">
        <strong>Get started with this short recording</strong>
      </div>
      <div className="card-body" />
      <video controls muted src={newVideo} className="video" />
      <br />
      <Link to="/">Ready to Login now?</Link>
    </div>
  </div>
);
export default LoginDetails;
