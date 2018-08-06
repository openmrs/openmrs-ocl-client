import React from 'react';
import PropTypes from 'prop-types';
import ActionButtons from '../component/ActionButtons';

const TableItem = (props) => {
  const {
    id, concept_class, datatype, display_name,
  } = props;
  return (
    <tr>
      <th scope="row">{display_name}</th>
      <td>{concept_class}</td>
      <td>{datatype}</td>
      <td>{id}</td>
      <td>
        <ActionButtons />
      </td>
    </tr>
  );
};

TableItem.propTypes = {
  id: PropTypes.string.isRequired,
  concept_class: PropTypes.string.isRequired,
  datatype: PropTypes.string.isRequired,
  display_name: PropTypes.string.isRequired,
};

export default TableItem;
