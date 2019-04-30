import React from 'react';
import ReactTable from 'react-table';
import PropTypes from 'prop-types';

const returnSource = (props) => {
  const { to_source_owner, to_source_name } = props.original;
  return `${to_source_owner} / ${to_source_name}`;
};

const MappingPreview = ({ title, body }) => {
  if (body === 'none') {
    return (
      <React.Fragment>
        <p className="synonyms">{title}</p>
        <div className="pop-up-description rounded">{body}</div>
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      <p className="synonyms">{title}</p>
      <ReactTable
        data={body}
        noDataText="No mappings found!"
        minRows={2}
        columns={[
          {
            Header: 'Relationship',
            accessor: 'map_type',
          },
          {
            Header: 'Name',
            accessor: 'to_concept_name',
          },
          {
            Header: 'Source',
            Cell: props => returnSource(props),
          },
          {
            Header: 'Code',
            accessor: 'to_concept_code',
          },
        ]}
        className="-striped -highlight mapping-preview"
        showPagination={false}
      />
    </React.Fragment>
  );
};

MappingPreview.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.any.isRequired,
};

export default MappingPreview;
