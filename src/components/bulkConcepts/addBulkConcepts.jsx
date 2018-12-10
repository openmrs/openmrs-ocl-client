import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import fetchCielConcepts, { addExistingBulkConcepts } from '../../redux/actions/bulkConcepts';
import BulkConceptList from './bulkConceptList';
import Header from './container/Header';

export class AddBulkConcepts extends Component {
  static propTypes = {
    fetchCielConcepts: PropTypes.func.isRequired,
    addExistingBulkConcepts: PropTypes.func.isRequired,
    cielConcepts: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
    })).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        type: PropTypes.string,
        typeName: PropTypes.string,
        collectionName: PropTypes.string,
      }).isRequired,
    }).isRequired,
    isFetching: PropTypes.bool.isRequired,
    language: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      cielConcepts: [],
      conceptLimit: 10,
    };
  }

  handleCielClick = () => {
    this.props.fetchCielConcepts();
  };

  render() {
    const dictionaryName = localStorage.getItem('dictionaryName');
    const {
      match: {
        params: { type, typeName, collectionName },
      },
      cielConcepts,
      language,
      isFetching,
    } = this.props;
    const disableButton = ((this.state.cielConcepts.length === 0) || isFetching);
    const { conceptLimit } = this.state;
    return (
      <div className="container-fluid add-bulk-concepts custom-max-width">
        <Header locationPath={this.props.match.params} />
        <h3>
          <strong>{dictionaryName} Dictionary</strong>: Bulk Add Concepts
        </h3>
        <div className="scheduler-border">
          <h3>Select a source</h3>
          <div className="select-box">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="exampleRadios"
                id="ciel"
                value="option1"
                onClick={this.handleCielClick}
              />
              <label className="form-check-label" htmlFor="exampleRadios1">
                CIEL
              </label>
            </div>
            <br />
            <div id="other-search">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="exampleRadios"
                  id="exampleRadios3"
                  value="option3"
                />
                <label className="form-check-label" htmlFor="exampleRadios3">
                  Other:&nbsp;&nbsp;
                </label>
                <form className="form-inline search-bar">
                  <i className="fas fa-search" />
                  <input
                    className="form-control"
                    id="search"
                    type="search"
                    placeholder="search"
                    aria-label="Search"
                  />
                </form>
              </div>
            </div>
          </div>
          <h3>Concept IDs to add</h3>
          <div className="preferred-concepts">
            <BulkConceptList
              cielConcepts={cielConcepts}
              fetching={this.props.isFetching}
              handleSelect={this.handleSelect}
              filterConcept={this.filterCaseInsensitive}
              conceptLimit={conceptLimit}
            />
          </div>
          <br />
          <div className="add-all-btn">
            <Link
              to={`/concepts/${type}/${typeName}/${collectionName}/${dictionaryName}/${language}/`}
              className="btn btn-secondary"
            >
              Cancel
            </Link>
            {' '}
            {this.state.cielConcepts.length === 0 ? (
            <button type="button" className="btn btn-primary" id="btn-add-all" disabled={disableButton}>
              <i className="fa fa-plus" /> Add
            </button>
            ) : (
            <button
              type="button"
              className="btn btn-primary btn-add-all"
              id="btn-add-all"
              onClick={this.handleAddAll}
              disabled={disableButton}
            >
              <i className="fa fa-plus" /> Add
            </button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export const mapStateToProps = state => ({
  cielConcepts: state.cielConcepts.cielConcepts,
  isFetching: state.cielConcepts.loading,
});
export default connect(
  mapStateToProps,
  { fetchCielConcepts, addExistingBulkConcepts },
)(AddBulkConcepts);
