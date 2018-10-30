import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Header = ({ locationPath }) => {
  const {
    type, typeName, collectionName, dictionaryName,
  } = locationPath;
  return (
    <section className="row concept-header">
      <div className="col-12">
        <div className="backLink">
          <Link
            to={`/dictionaryOverview/${type}/${typeName}/collections/${collectionName}`}
            className="collection-name small-text"
          >
            <i className="fas fa-arrow-left">
              {' '}
              <span className="collection-name">
Go back to
                {' '}
                {dictionaryName}
                {' '}
overview
              </span>
            </i>
          </Link>
        </div>
        <header>
          <h2 className="text-capitalize">
            {dictionaryName}
            {' '}
Dictionary
          </h2>
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
