import React from 'react';
import PropTypes from 'prop-types';
import { INTERNAL_MAPPING_DEFAULT_SOURCE } from './helperFunction';

const mapType = (props) => {
  const {
    source, index, map_type, updateEventListener,
  } = props;
  const mapTypeInput = source === INTERNAL_MAPPING_DEFAULT_SOURCE
    ? (<input
      type="text"
      rows="3"
      className="form-control concept-description"
      name="map_type"
      placeholder="Relationship"
      onChange={updateEventListener}
      defaultValue={map_type}
      tabIndex={index}
    />)
    : (
      <select
        tabIndex={index}
        defaultValue={map_type}
        className="form-control"
        placeholder="map type"
        type="text"
        name="map_type"
        onChange={updateEventListener}
      >
        <option>Same as</option>
        <option>Narrower than</option>
      </select>
    );
  return mapTypeInput;
};

mapType.propTypes = {
  source: PropTypes.string,
  index: PropTypes.number,
  updateEventListener: PropTypes.func,
};

mapType.defaultProps = {
  source: '',
  index: 0,
  updateEventListener: () => {},
};

export default mapType;
