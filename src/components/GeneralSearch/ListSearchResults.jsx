import React from 'react';
import PropTypes from 'prop-types';
import Card from '../dashboard/components/dictionary/DictionaryCard';
import Loader from '../Loader';

const ListDictionaries = ({
  dictionaries, fetching,
}) => {
  if (fetching) {
    return (
      <div className="text-center mt-3">
        <Loader />
      </div>
    );
  }
  if (dictionaries.length >= 1) {
    return (
      <div>
        <div className="row justify-content-center">
          {dictionaries.map(dictionary =>
            (<Card
              dictionary={dictionary}
              key={dictionary.uuid}
            />))}
        </div>
      </div>
    );
  }
  return (
    <div className="text-center mt-3" id="Noresults">
      <h5>No Results Found <span aria-label="sad-emoji" role="img"> 😞 </span> </h5>
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
