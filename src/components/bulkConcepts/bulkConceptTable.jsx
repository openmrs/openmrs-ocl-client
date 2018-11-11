import React from 'react';

const BulkConceptTable = (concept) => {
  const {
    concept: {
      id,
      display_name,
      datatype,
      sources,
      url,
    },
    handleSelect,
  } = concept;
  return (
    <tr className="concept-table">
      <td>
        <div className="custom-control custom-checkbox">
          <input
            type="checkbox"
            className="table-check"
            value={url}
            onChange={handleSelect}
          />
        </div>
      </td>

      <td>{display_name}</td>
      <td>{datatype}</td>
      <td>{sources}</td>
      <td>{id}</td>
    </tr>
  );
};
export default BulkConceptTable;
