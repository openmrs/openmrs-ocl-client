import React from 'react';
import PropTypes from 'prop-types';
import Card from './SourceCard';
import Loader from '../../Loader';

const ListWrapper = ({ sources, fetching }) => {
  if (sources.length >= 1) {
    return (
      <div className="row justify-content-center">
        {sources.map(source => (
          <Card source={source} key={source.uuid} />
        ))}
      </div>
    );
  }
  if (fetching) {
    return (
      <div className="text-center mt-3">
        <Loader />
      </div>
    );
  }
  return (
    <div className="text-center mt-3 p-10">
      <h6 className="p-20">No source found</h6>
    </div>
  );
};

ListWrapper.propTypes = {
  fetching: PropTypes.bool.isRequired,
  sources: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
  })).isRequired,
};
export default ListWrapper;
