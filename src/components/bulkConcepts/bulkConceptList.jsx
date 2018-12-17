import React from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  FormGroup,
  Input,
} from 'reactstrap';
import Loader from '../Loader';

const BulkConceptList = ({
  cielConcepts,
  fetching,
}) => {
  if (cielConcepts.length >= 1) {
    return (
      <Form className="bulkForm">
        <FormGroup>
          <Input type="textarea" name="text" id="exampleText" rows="10" />
        </FormGroup>
      </Form>
    );
  }
  if (fetching) {
    return (
      <div className="text-center mt-3">
        <Loader />
      </div>
    );
  }
  return (
    <div className="text-center mt-3">
      <h5>No concept found</h5>
    </div>
  );
};
BulkConceptList.propTypes = {
  fetching: PropTypes.bool.isRequired,
  cielConcepts: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
  })).isRequired,
};
export default BulkConceptList;
