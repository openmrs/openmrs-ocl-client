import React from 'react';
import PropTypes from 'prop-types';
import Card from './DictionaryCard';
import Loader from '../../../Loader';

const ListDictionaries = (props) => {
  const { dictionaries, fetching } = props;
  if (fetching) {
    return (
      <div className="row jusify-content-center">
        <div className="col-md-12 text-center">
          <Loader />
        </div>
      </div>
    );
  }
  if (dictionaries.length >= 1) {
    return (
      <div className="container">
        <div className="row justify-content-center">
          {dictionaries.map(dictionary => (
            <Card dictionary={dictionary} key={dictionary.uuid} {...props} />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="text-center mt-3">
      <h5>
        No Dictionaries Found{' '}
        <span aria-label="sad-emoji" role="img">
          {' '}
          😞{' '}
        </span>{' '}
      </h5>
    </div>
  );
};

ListDictionaries.propTypes = {
  fetching: PropTypes.bool.isRequired,
  dictionaries: PropTypes.arrayOf(PropTypes.shape({
    dictionaryName: PropTypes.string,
  })).isRequired,
};
export default ListDictionaries;
