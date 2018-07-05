import React from 'react';
import '../../styles/index.css';
import AddConceptModal from './ConceptModal';

const SpecificConceptTable = (concept) => {
  const {
    concept: {
      id,
      concept_class,
      datatype,
      display_name,
      source,
      owner,
    },
  } = concept;
  return (
    <tr className="concept-table">
      <td className="table1">{id}</td>
      <td className="table2">{display_name}</td>
      <td>
        {concept_class} / {datatype}
      </td>
      <td className="table3">
        <a className="dummy-link"> Add </a> {' '}
        <a href="!#" className="add-btn" data-toggle="modal" data-target={`#conceptPreview${id}`}>
          Preview
        </a>
      </td>
      <AddConceptModal
        id={id}
        display_name={display_name}
        concept_class={concept_class}
        source={source}
        owner={owner}
      />
    </tr>
  );
};

export default SpecificConceptTable;
