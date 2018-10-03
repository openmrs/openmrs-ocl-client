import React from 'react';
import PropTypes from 'prop-types';

const removeConcept = (props) => {
  const { handleDelete } = props;
  return (
    <div>
      <div
        className="container modal fade"
        id="removeConceptModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="container modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <p className="modal-title" id="exampleModalLabel">
                  Are you sure you want to Remove this Concept?
              </p>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div>
              <form>
                <div className="modal-footer" type="submit">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-dismiss="modal"
                  >
                  Cancel
                  </button>
                  <button
                    type="button"
                    data-dismiss="modal"
                    className="btn btn-danger"
                    onClick={handleDelete}
                  >
                  Remove Concept
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
removeConcept.propTypes = {
  handleDelete: PropTypes.func.isRequired,
};

export default removeConcept;

