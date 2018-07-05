import React from 'react';
import PropTypes from 'prop-types';

const Header = ({ typeName }) => (
  <section className="row concept-header">
    <div className="col-12">
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
