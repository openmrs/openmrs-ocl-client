import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import Loader from '../../Loader';
import ActionButtons from './ActionButtons';
import { conceptsProps } from '../../dictionaryConcepts/proptypes';
import ConceptPagination from './ConceptPagination';

const ConceptTable = ({
  concepts, loading, location, preview, previewConcept, addConcept, conceptLimit, currentPage,
  modalId, openModal, closeModal, questionAnswers, recursiveQuestionAnswers,
}) => {
  if (loading) {
    return (
      <div className="mt-200 text-center">
        <Loader />
      </div>
    );
  }
  return (
    <div className="row col-12 custom-concept-list">
      <ReactTable
        data={concepts}
        currentPage={currentPage}
        loading={loading}
        PaginationComponent={ConceptPagination}
        defaultPageSize={concepts.length <= conceptLimit ? concepts.length : conceptLimit}
        noDataText="No concepts found!"
        minRows={2}
        limitCount={10}
        columns={[
          {
            Header: 'Name',
            accessor: 'display_name',
            minWidth: 300,
          },
          {
            Header: 'Class',
            accessor: 'concept_class',
          },
          {
            Header: 'Datatype',
            accessor: 'datatype',
          },
          {
            Header: 'ID',
            accessor: 'id',
          },
          {
            Header: 'Action',
            width: 250,
            Cell: ({ original: concept }) => (
              <ActionButtons
                preview={preview}
                modalId={modalId}
                closeModal={closeModal}
                openModal={openModal}
                previewConcept={previewConcept}
                addConcept={addConcept}
                params={location}
                questionAnswers={questionAnswers}
                recursiveQuestionAnswers={recursiveQuestionAnswers}
                {...concept}
              />
            ),
          },
        ]}
        className="-striped -highlight"
      />
    </div>
  );
};

ConceptTable.propTypes = {
  concepts: PropTypes.arrayOf(PropTypes.shape(conceptsProps)).isRequired,
  original: PropTypes.object,
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
  openModal: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  previewConcept: PropTypes.func.isRequired,
  conceptLimit: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  questionAnswers: PropTypes.array,
  recursiveQuestionAnswers: PropTypes.array,
  modalId: PropTypes.string,
};
ConceptTable.defaultProps = {
  original: {},
  modalId: '',
  questionAnswers: [],
  recursiveQuestionAnswers: [],
};

export default ConceptTable;
