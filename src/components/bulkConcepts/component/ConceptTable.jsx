import React from 'react';
import PropTypes from 'prop-types';
import Loader from '../../Loader';
import RenderTable from '../../dictionaryConcepts/components/RenderTable';
import TableItem from '../component/TableItem';
import { conceptsProps } from '../../dictionaryConcepts/proptypes';

const ConceptTable = ({
  concepts, loading, location, preview, previewConcept, addConcept,
}) => {
  if (loading) {
    return (
      <RenderTable
        render={() => (
          <tr>
            <th scope="row" colSpan="6" className="text-center">
              <Loader />
            </th>
          </tr>
        )}
      />
    );
  }
  if (concepts.length > 0) {
    return (
      <div className="row col-12 custom-concept-list">
        <table className="table table-striped table-bordered">
          <thead className="header text-white">
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Class</th>
              <th scope="col">Datatype</th>
              <th scope="col">ID</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody id="table-body">
            {concepts.map(concept => (
              <TableItem
                {...concept}
                key={concept.version}
                params={location}
                preview={preview}
                previewConcept={previewConcept}
                addConcept={addConcept}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  return (
    <RenderTable
      render={() => (
        <tr>
          <th scope="row" colSpan="6" className="text-center" id="emptyConcept">
            No concepts found
          </th>
        </tr>
      )}
    />
  );
};

ConceptTable.propTypes = {
  concepts: PropTypes.arrayOf(PropTypes.shape(conceptsProps)).isRequired,
  loading: PropTypes.bool.isRequired,
  location: PropTypes.shape({
    type: PropTypes.string,
    typeName: PropTypes.string,
    collectionName: PropTypes.string,
  }).isRequired,
  preview: PropTypes.shape({
    url: PropTypes.string,
    display_name: PropTypes.string,
  }).isRequired,
  addConcept: PropTypes.func.isRequired,
  previewConcept: PropTypes.func.isRequired,
};

export default ConceptTable;
