import React from 'react';
import PropTypes from 'prop-types';
import ActionButtons from './ActionButtons';
import { getUsername } from './helperFunction';
import RemoveConcept from './RemoveConcept';

const TableItem = (props) => {
  const username = getUsername();
  const {
    id,
    concept_class,
    datatype,
    source,
    owner,
    display_name,
    org,
    locationPath,
    handleDelete,
    url,
    openDeleteModal,
    closeDeleteModal,
  } = props;
  const renderButtons = username === owner || (owner === org.name && org.userIsMember);
  return (
    <React.Fragment>
      <tr>
        <th scope="row">{display_name}</th>
        <td>{concept_class}</td>
        <td>{datatype}</td>
        <td>{source}</td>
        <td>{id}</td>
        <td>
          <ActionButtons actionButtons={renderButtons} {...props} />
        </td>
        <td className="hidden">
          <RemoveConcept
            collectionName={locationPath.collectionName}
            conceptOwner={locationPath.typeName}
            conceptUrl={url}
            conceptType={locationPath.type}
            handleDelete={handleDelete}
            openDeleteModal={openDeleteModal}
            closeDeleteModal={closeDeleteModal}
          />
        </td>
      </tr>
    </React.Fragment>
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
  locationPath: PropTypes.object.isRequired,
};

export default TableItem;
