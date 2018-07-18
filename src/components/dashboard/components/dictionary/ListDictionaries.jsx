import React from 'react';
import PropTypes from 'prop-types';
import Card from './DictionaryCard';
import Loader from '../../../Loader';

const ListDictionaries = ({
  dictionaries, fetching, fetchData,
}) => {
  if (fetching) {
    return (
      <div className="text-center mt-3" id="load">
        <Loader />
      </div>
    );
  }
  if (dictionaries.length >= 1) {
    return (
      <div className="row justify-content-center">
        {dictionaries.map(dictionary =>
          (<Card
            dictionary={dictionary}
            key={dictionary.uuid}
            fetchData={fetchData}
          />))}

      </div>

    );
  }
  return (
    <div className="text-center mt-3">
      <h5>No Dictionaries Found <span aria-label="sad-emoji" role="img"> 😞 </span> </h5>
    </div>
  );
};

ListDictionaries.propTypes = {
  fetching: PropTypes.bool.isRequired,
  dictionaries: PropTypes.arrayOf(PropTypes.shape({
    dictionaryName: PropTypes.string,
  })).isRequired,
  fetchData: PropTypes.func.isRequired,
};
export default ListDictionaries;
