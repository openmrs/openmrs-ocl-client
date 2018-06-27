import React from 'react';
import PropTypes from 'prop-types';

// eslint-disable-next-line
class RenderTable extends React.Component {
  render() {
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
          <tbody>{this.props.render()}</tbody>
        </table>
      </div>
    );
  }
}

RenderTable.propTypes = {
  render: PropTypes.func.isRequired,
};

export default RenderTable;
