import React from 'react';
import AddConceptModal from './ConceptModal';

const ConceptTable = (concept) => {
  const {
    concept: {
      id,
      display_name,
      concept_class,
      datatype,
      source,
      owner,
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
      <td>
        <a className="dummy-link"> Add </a>{' '}
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

export default ConceptTable;
