import React from 'react';
import PropTypes from 'prop-types';
import TableItem from './TableItem';
import Loader from '../../Loader';
import RenderTable from './RenderTable';
import { conceptsProps } from '../proptypes';

const ConceptTable = ({ concepts, loading }) => {
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
              <th scope="col">Source</th>
              <th scope="col">ID</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>{concepts.map(concept => <TableItem {...concept} key={concept.version} />)}</tbody>
        </table>
      </div>
    );
  }
  return (
    <RenderTable
      render={() => (
        <tr>
          <th scope="row" colSpan="6" className="text-center">
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
};

export default ConceptTable;
