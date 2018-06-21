import React from 'react';
import '../../styles/index.css';

const SpecificConceptTable = (concept) => {
  const {
    concept: {
      id,
      concept_class,
      datatype,
      display_name,
    },
  } = concept;
  return (
    <tr className="concept-table">
      <td className="table1" >{id}</td>
      <td className="table2">{display_name}</td>
      <td>{concept_class}{' '}/{' '}{datatype}</td>
    </tr>

  );
};

export default SpecificConceptTable;
