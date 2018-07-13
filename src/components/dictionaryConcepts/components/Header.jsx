import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Header = ({ locationPath }) => {
  const { type, typeName, collectionName } = locationPath;
  return (
    <section className="row concept-header">
      <div className="col-12">
        <div>
          <Link
            to={`/dictionaryOverview/${type}/${typeName}/collections/${collectionName}`}
            className="collection-name small-text"
          >
            <i className="fas fa-chevron-left" /> Go back to {collectionName} dictionary
          </Link>
        </div>
        <header>
          <h2 className="text-capitalize">{collectionName} Dictionary</h2>
        </header>
      </div>
    </section>
  );
};

Header.propTypes = {
  locationPath: PropTypes.shape({
    type: PropTypes.string.isRequired,
    typeName: PropTypes.string.isRequired,
    collectionName: PropTypes.string.isRequired,
  }).isRequired,
};
export default Header;
