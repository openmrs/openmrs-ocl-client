import React from 'react';

const ConceptTable = (concept) => {
  const {
    concept: {
      id, display_name, concept_class, datatype, source,
    },
  } = concept;
  return (
    <tr className="concept-table">
      <td>{id}</td>
      <td style={{ maxWidth: '25rem' }} className="display-name">
        {display_name}
      </td>
      <td>
        {concept_class}/ {datatype}
      </td>
      <td>{source}</td>
    </tr>
  );
};

export default ConceptTable;
