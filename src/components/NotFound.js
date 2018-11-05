import React from 'react';

const NotFound = () => (
  <div className="not-found">
    <div className="not-found-container">
      <h2 className="error-template">Oops!, Page Not Found</h2>

      <div className="error-actions">
        <a href="/" className="btn btn-primary btn-lg btn-not-found">
          <span className="fa fa-home" />
              Take me back home
          {' '}
        </a>
      </div>

    </div>
  </div>
);
export default NotFound;
