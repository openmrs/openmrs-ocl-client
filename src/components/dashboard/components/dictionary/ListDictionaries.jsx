import React from 'react';
import PropTypes from 'prop-types';
import Card from './DictionaryCard';
import Loader from '../../../Loader';

const ListDictionaries = ({
  dictionaries, fetching, fetchData, dictionaryViewOptions,
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
        { dictionaryViewOptions === 'user' ?
          <div className="row justify-content-center">
            {dictionaries.map((dictionary, index) => {
            return dictionary.created_by === localStorage.getItem('username')
              && dictionaryViewOptions === 'user' ?
                <Card
                  dictionary={dictionary}
                  key={dictionary.uuid}
                  fetchData={fetchData}
                />
              :
                <div key={index}> {' '} </div>;
          })}
          </div>
        :
          <div className="row justify-content-center">
            {dictionaries.map((dictionary, index) => {
            return dictionary.repository_type === 'OpenMRSDictionary'
              && dictionaryViewOptions === 'organizations' ?
                <Card
                  dictionary={dictionary}
                  key={dictionary.uuid}
                  fetchData={fetchData}
                />
              :
                <div key={index}> {' '} </div>;
          })}
          </div>
        }
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
  dictionaryViewOptions: PropTypes.string.isRequired,
};
export default ListDictionaries;
