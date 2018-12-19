import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Header = ({ locationPath }) => {
  const {
    type,
    typeName,
    collectionName,
    dictionaryName,
    language,
  } = locationPath;
  return (
    <section className="row concept-header">
      <div className="col-12">
        <div className="backLink">
          <Link
            to={`/concepts/${type}/${typeName}/${collectionName}/${dictionaryName}/${language}/`}
            className="collection-name small-text"
          >
            <i className="fas fa-arrow-left">
              &nbsp;
              <span className="collection-name">
              Go back to
                {' '}
                {dictionaryName}
                {' '}
concepts
              </span>
            </i>
          </Link>
        </div>
      </div>
    </section>
  );
};

Header.propTypes = {
  locationPath: PropTypes.shape({
    type: PropTypes.string.isRequired,
    typeName: PropTypes.string.isRequired,
    collectionName: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    dictionaryName: PropTypes.string.isRequired,
  }).isRequired,
};
export default Header;
