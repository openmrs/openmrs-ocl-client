import React from 'react';

const ConceptTable = (concept) => {
  const {
    concept: {
      id,
      display_name,
      concept_class,
      datatype,
      source,
    },
  } = concept;
  return (


    <tr className="concept-table">
      <th scope="row"><div style={{ maxWidth: '15rem' }} >{display_name}</div></th>
      <td >{concept_class}</td>
      <td>{datatype}</td>
      <td>{source}</td>
      <td>{id}</td>
    </tr>
  );
};

export default ConceptTable;
