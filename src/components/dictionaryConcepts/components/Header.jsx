import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Header = ({ typeName }) => (
  <section className="row concept-header">
    <div className="col-12">
      <div>
        <Link to="/dashboard/dictionaries" className="collection-name small-text">
          <i className="fas fa-chevron-left" /> Go back to dictionaries
        </Link>
      </div>
      <header>
        <h2 className="text-capitalize">{typeName} Dictionary</h2>
      </header>
    </div>
  </section>
);

Header.propTypes = {
  typeName: PropTypes.string.isRequired,
};
export default Header;
