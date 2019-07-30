import { Link } from 'react-router-dom';
import React from 'react';
import PropTypes from 'prop-types';

const ViewMapping = (
  {
    toSourceName,
    mapType,
    toConceptCode,
    toConceptName,
    toConceptUrl,
    showMappingType,
  },
) => (
  <tr>
    <td>{toSourceName}</td>
    {showMappingType ? (
      <td>{mapType}</td>
    ) : ''}
    <td>
      {`ID(${toConceptCode})`}
      {toConceptName ? `- ${toConceptName}` : ''}
    </td>
    <td>
      {toConceptUrl ? (
        <Link
          to={toConceptUrl}
          className="edit-button-link btn btn-sm mb-1"
        >
          View Concept
        </Link>
      ) : ''}
    </td>
  </tr>
);

ViewMapping.propTypes = {
  toSourceName: PropTypes.string.isRequired,
  mapType: PropTypes.string.isRequired,
  toConceptCode: PropTypes.string.isRequired,
  toConceptName: PropTypes.string.isRequired,
  toConceptUrl: PropTypes.string.isRequired,
  showMappingType: PropTypes.bool.isRequired,
};

export default ViewMapping;
