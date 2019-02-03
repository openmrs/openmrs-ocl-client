import React from 'react';
import PropTypes from 'prop-types';

const mapType = (props) => {
  const {
    index, map_type, map_types, updateEventListener,
  } = props;
  return (
    <select
      tabIndex={index}
      defaultValue={map_type}
      className="form-control"
      placeholder="map type"
      type="text"
      name="map_type"
      onChange={updateEventListener}
    >
      {
      map_types.map(_ => <option key={_}>
        {' '}
        { _ }
        {' '}
      </option>)
    }
    </select>
  );
};

mapType.propTypes = {
  map_type: PropTypes.string,
  index: PropTypes.number,
  updateEventListener: PropTypes.func,
  map_types: PropTypes.array,
};

mapType.defaultProps = {
  map_type: '',
  index: 0,
  updateEventListener: () => {},
  map_types: ['SAME-AS', 'NARROWER-THAN', 'BROADER-THAN', 'Associated finding', 'Associated morphology',
    'Associated procedure', 'Associated with', 'Causative agent', 'Finding site', 'Has specimen', 'Laterality', 'Severity', 'Access', 'After',
    'Clinical course', 'Component', 'Direct device', 'Direct morphology', 'Direct substance', 'Due to', 'Episodicity', 'Finding context',
    'Finding informer', 'Finding method', 'Has active ingredient', 'Has definitional manifestation', 'Has dose form', 'Has focus', 'Has intent',
    'Has interpretation', 'Indirect device', 'Indirect morphology', 'Interprets', 'Measurement method', 'Method', 'Occurrence', 'Part of',
    'Pathological process', 'Priority', 'Procedure context', 'Procedure device', 'Procedure morphology', 'Procedure site', 'Procedure site - Direct',
    'Procedure site - Indirect', 'Property', 'Recipient category', 'Revision status', 'Route of administration', 'Scale type', 'Specimen procedure',
    'Specimen source identity', 'Specimen source morphology', 'Specimen source topography', 'Specimen substance', 'Subject of information',
    'Subject relationship context', 'Surgical approach', 'Temporal context', 'Time aspect', 'Using access device', 'Using device', 'Using energy',
    'Using substance', 'IS A', 'MAY BE A', 'MOVED FROM', 'MOVED TO', 'REPLACED BY', 'WAS A'],
};

export default mapType;
