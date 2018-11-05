import React from 'react';
import PropTypes from 'prop-types';
import ConceptNameRows from './ConceptNameRows';

const CreateConceptTable = props => (
  <table className="table table-striped table-bordered concept-form-table">
    <thead className="header text-white">
      <tr>
        <th scope="col">Name</th>
        <th scope="col">Type</th>
        <th scope="col">Language</th>
        <th scope="col">Preferred in locale</th>
        <th scope="col">Actions</th>
      </tr>
    </thead>
    <tbody>
      {props.existingConcept && props.existingConcept.names
        ? props.existingConcept.names.map(newRow => (
          <ConceptNameRows newRow={newRow} key={newRow.uuid} {...props} />
        ))
        : props.nameRows.map(newRow => (
          <ConceptNameRows newRow={{ uuid: newRow }} key={newRow} {...props} />
        ))}
    </tbody>
  </table>
);

CreateConceptTable.propTypes = {
  nameRows: PropTypes.array.isRequired,
  existingConcept: PropTypes.shape({
    descriptions: PropTypes.arrayOf(PropTypes.shape({
      uuid: PropTypes.string,
      locale: PropTypes.string,
      description: PropTypes.string,
    })),
    names: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      uuid: PropTypes.string.isRequired,
      name: PropTypes.string,
      locale: PropTypes.string,
      locale_full: PropTypes.string,
      locale_preferred: PropTypes.bool,
      name_type: PropTypes.string,
    })),
  }),
};

CreateConceptTable.defaultProps = {
  existingConcept: {
    descriptions: [],
    names: [],
  },
};

export default CreateConceptTable;
