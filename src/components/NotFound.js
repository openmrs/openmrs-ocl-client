import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="not-found">
    <div className="not-found-container">
      <h2 className="error-template">Oops!, Page Not Found</h2>

      <div className="error-actions">
        <Link to="/" className="btn btn-primary btn-lg btn-not-found">
          <span className="fa fa-home" />
              Take me back home
          {' '}
        </Link>
      </div>

    </div>
  </div>
);
export default NotFound;
