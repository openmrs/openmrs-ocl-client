import React from 'react';

const BulkConceptTable = (concept) => {
  const {
    concept: {
      id,
      display_name,
    },
  } = concept;
  return (
    <tr className="concept-table">
      <td>{id}</td>
      <td>{display_name}</td>
    </tr>
  );
};
export default BulkConceptTable;
