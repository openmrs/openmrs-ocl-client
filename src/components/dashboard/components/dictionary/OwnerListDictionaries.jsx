import React from 'react';
import PropTypes from 'prop-types';
import Card from './DictionaryCard';
import Loader from '../../../Loader';

const OwnerListDictionaries = ({
  dictionaries, fetching, fetchData,
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
      <div className="row justify-content-center">
        {dictionaries.map(dictionary => (dictionary.created_by === localStorage.getItem('username') ?
          <Card
            dictionary={dictionary}
            key={dictionary.uuid}
            fetchData={fetchData}
          />
                        :
          <div />))}
      </div>
    );
  }

  return (
    <div className="text-center mt-3">
      <h5>No Dictionaries Found <span aria-label="sad-emoji" role="img"> 😞 </span> </h5>
    </div>
  );
};

OwnerListDictionaries.propTypes = {
  fetching: PropTypes.bool.isRequired,
  dictionaries: PropTypes.arrayOf(PropTypes.shape({
    dictionaryName: PropTypes.string,
  })).isRequired,
  fetchData: PropTypes.func.isRequired,
};
export default OwnerListDictionaries;
