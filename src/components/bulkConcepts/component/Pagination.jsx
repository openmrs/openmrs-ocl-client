import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  setNextPage,
  setPreviousPage,
} from '../../../redux/actions/concepts/addBulkConcepts';


export class Paginations extends Component {
  static propTypes = {
    firstDictionaryIndex: PropTypes.number.isRequired,
    dictionaries: PropTypes.number.isRequired,
    currentPage: PropTypes.number,
    lastPage: PropTypes.number,
    setNextPage: PropTypes.func.isRequired,
    setPreviousPage: PropTypes.func.isRequired,
    view: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    currentPage: 1,
    lastPage: 2,
  }

  render() {
    const {
      firstDictionaryIndex, dictionaries, lastPage, currentPage,
      setNextPage: NextPage, setPreviousPage: PreviousPage, view,
    } = this.props;
    return (
      <Fragment>
        {view && (
        <div className="container">
          <div className="row">
            <div className="col-md-6 text-left">
              <span>
                Showing
                {' '}
                {firstDictionaryIndex}
                -
                {dictionaries}
                {' '}
                of
                {' '}
                many
                {' '}
                concepts
              </span>
            </div>
            <div className="col-6 text-right">
              <span className="paginate-controllers">
                {currentPage > 1 ? (
                  <i
                    className="fas fa-angle-double-left prev"
                    role="presentation"
                    id={currentPage - 1}
                    onClick={PreviousPage}
                  />
                ) : (
                  <i className="fas fa-angle-double-left disabled" role="presentation" />
                )}
                <span className="badge badge-light">
                  <h6>{currentPage}</h6>
                </span>
                {currentPage < lastPage ? (
                  <i
                    className="fas fa-angle-double-right nxt"
                    role="presentation"
                    id={currentPage + 1}
                    onClick={NextPage}
                  />
                ) : (
                  <i className="fas fa-angle-double-right disabled" role="presentation" />
                )}
              </span>
            </div>
          </div>
        </div>
        )}
      </Fragment>
    );
  }
}

export const mapStateToProps = ({ bulkConcepts }) => ({
  ...bulkConcepts,
});

export default connect(
  mapStateToProps,
  {
    setNextPage,
    setPreviousPage,
  },
)(Paginations);
