import React from 'react';
import PropTypes from 'prop-types';
import ActionButtons from './ActionButtons';

const TableItem = (props) => {
  const {
    id,
    concept_class,
    datatype,
    display_name,
    addConcept,
    params,
    preview,
    previewConcept,
  } = props;
  return (
    <tr>
      <th scope="row">{display_name}</th>
      <td>{concept_class}</td>
      <td>{datatype}</td>
      <td>{id}</td>
      <td>
        <ActionButtons
          addConcept={addConcept}
          params={params}
          id={id}
          preview={preview}
          previewConcept={previewConcept}
        />
      </td>
    </tr>
  );
};

TableItem.propTypes = {
  id: PropTypes.string.isRequired,
  concept_class: PropTypes.string.isRequired,
  datatype: PropTypes.string.isRequired,
  display_name: PropTypes.string.isRequired,
  addConcept: PropTypes.func.isRequired,
  params: PropTypes.shape({
    type: PropTypes.string,
    typeName: PropTypes.string,
    collectionName: PropTypes.string,
  }).isRequired,
  preview: PropTypes.shape({
    url: PropTypes.string,
    display_name: PropTypes.string,
  }).isRequired,
  previewConcept: PropTypes.func.isRequired,
};

export default TableItem;
