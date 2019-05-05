import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const Paginations = props => (
  <Fragment>
    {props.totalDictionaries > 0 && (
      <div className="container">
        <div className="row">
          <div className="col-md-6 text-left">
            <span>
              Showing
              {' '}
              {props.firstDictionaryIndex}
-
              {props.dictionaries}
              {' '}
of
              {' '}
              {props.totalDictionaries}
              {' '}
              dictionaries
            </span>
          </div>
          <div className="col-6 text-right">
            <span className="paginate-controllers">
              {props.currentPage > 1 ? (
                <i
                  className="fas fa-angle-double-left prev"
                  role="presentation"
                  id={props.currentPage - 1}
                  onClick={props.handleClick}
                />
              ) : (
                <i className="fas fa-angle-double-left disabled" role="presentation" />
              )}
              <span className="badge badge-light">
                <h6>{props.currentPage}</h6>
              </span>
              {props.currentPage < props.lastPage ? (
                <i
                  className="fas fa-angle-double-right nxt"
                  role="presentation"
                  id={props.currentPage + 1}
                  onClick={props.handleClick}
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

Paginations.propTypes = {
  totalDictionaries: PropTypes.number.isRequired,
  firstDictionaryIndex: PropTypes.number.isRequired,
  dictionaries: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  lastPage: PropTypes.number.isRequired,
  handleClick: PropTypes.func.isRequired,
};

export default Paginations;
