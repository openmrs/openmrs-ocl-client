import React from 'react';
import PropTypes from 'prop-types';
import Card from './DictionaryCard';
import Loader from '../../../Loader';

const ListDictionaries = (props) => {
  const { dictionaries, fetching, searchHasBeenDone } = props;
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
        <div className="row">
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
        {searchHasBeenDone ? 'No Dictionaries Found' : 'Search to find Public Dictionaries'}
      </h5>
    </div>
  );
};

ListDictionaries.propTypes = {
  fetching: PropTypes.bool.isRequired,
  dictionaries: PropTypes.arrayOf(PropTypes.shape({
    dictionaryName: PropTypes.string,
  })).isRequired,
  searchHasBeenDone: PropTypes.bool,
};

ListDictionaries.defaultProps = {
  searchHasBeenDone: true,
};

export default ListDictionaries;
