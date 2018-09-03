import React from 'react';
import PropTypes from 'prop-types';
import ActionButtons from './ActionButtons';
import { getUsername } from './helperFunction';

const TableItem = (props) => {
  const username = getUsername();
  const {
    id, concept_class, datatype, source, owner, display_name, org,
  } = props;
  const renderButtons = username === owner || (owner === org.name && org.userIsMember);

  return (
    <tr>
      <th scope="row">{display_name}</th>
      <td>{concept_class}</td>
      <td>{datatype}</td>
      <td>{source}</td>
      <td>{id}</td>
      <td>
        <ActionButtons actionButtons={renderButtons} {...props} />
      </td>
    </tr>
  );
};

TableItem.propTypes = {
  id: PropTypes.string.isRequired,
  concept_class: PropTypes.string.isRequired,
  datatype: PropTypes.string.isRequired,
  source: PropTypes.string.isRequired,
  owner: PropTypes.string.isRequired,
  display_name: PropTypes.string.isRequired,
  org: PropTypes.object.isRequired,
};

export default TableItem;
