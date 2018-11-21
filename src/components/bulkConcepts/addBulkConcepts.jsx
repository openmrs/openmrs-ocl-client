import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import matchSorter from 'match-sorter';
import fetchCielConcepts, { addExistingBulkConcepts } from '../../redux/actions/bulkConcepts';
import BulkConceptList from './bulkConceptList';
import Header from './container/Header';
import Paginations from './component/Paginations';

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
  };

  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      cielConcepts: [],
      conceptLimit: 10,
    };
  }

  handleAddAll = () => {
    const {
      match: {
        params: { type, typeName, collectionName },
      },
    } = this.props;
    const url = `${type}/${typeName}/collections/${collectionName}/references/`;
    const { cielConcepts } = this.state;
    this.props.addExistingBulkConcepts({ url, data: { data: { expressions: cielConcepts } } });
    window.history.back();
  };
  handleCielClick = () => {
    this.props.fetchCielConcepts();
  };
  handleSelect = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      this.setState({
        cielConcepts: [value, ...this.state.cielConcepts],
      });
    } else {
      const index = this.state.cielConcepts.indexOf(value);
      this.setState({
        cielConcepts: this.state.cielConcepts.filter((_, i) => i !== index),
      });
    }
  };
  handlePaginationClick = (e) => {
    e.preventDefault();
    const { id } = e.target;
    this.setState({ currentPage: Number(id) });
  };

  filterCaseInsensitive = (filter, rows) => {
    const id = filter.pivotId || filter.id;
    return matchSorter(rows, filter.value, { keys: [id] });
  };

  render() {
    const dictionaryName = localStorage.getItem('dictionaryName');
    const { cielConcepts } = this.props;
    const { currentPage, conceptLimit } = this.state;
    const conceptsPerPage = 20;
    const indexOfLastConcept = currentPage * conceptsPerPage;
    const indexOfFirstConcept = indexOfLastConcept - conceptsPerPage;
    const currentConcepts = cielConcepts.slice(indexOfFirstConcept, indexOfLastConcept);
    const lastPage = Math.ceil(cielConcepts.length / conceptsPerPage);
    const lastConcept = indexOfFirstConcept + currentConcepts.length;
    const firstConcept = indexOfLastConcept - 19;
    return (
      <div className="container-fluid add-bulk-concepts custom-max-width">
        <Header locationPath={this.props.match.params} />
        <h3>
          <strong>{dictionaryName} Dictionary</strong>: Bulk Add Concepts
        </h3>
        <fieldset className="scheduler-border">
          <legend className="scheduler-border">Select a source</legend>
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
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="exampleRadios"
                id="exampleRadios2"
                value="option2"
              />
              <label className="form-check-label" htmlFor="exampleRadios2">
                (Other preferred sources here)
              </label>
            </div>{' '}
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
        </fieldset>
        <h4>Concept IDs to add</h4>
        <Paginations
          concepts={lastConcept}
          firstConceptIndex={firstConcept}
          totalConcepts={cielConcepts.length}
          currentPage={currentPage}
          handleClick={this.handlePaginationClick}
          lastPage={lastPage}
        />
        <div className="preferred-concepts">
          <BulkConceptList
            cielConcepts={currentConcepts}
            fetching={this.props.isFetching}
            handleSelect={this.handleSelect}
            filterConcept={this.filterCaseInsensitive}
            conceptLimit={conceptLimit}
          />
        </div>
        <br />
        <div className="add-all-btn">
          <a href={document.referrer}>
            <button type="button" className="btn btn-secondary">
              Back
            </button>
          </a>{' '}
          {this.state.cielConcepts.length === 0 ? (
            <button type="button" className="btn btn-primary" id="btn-add-all" disabled>
              <i className="fa fa-plus" /> Add All Selected
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary btn-add-all"
              id="btn-add-all"
              onClick={this.handleAddAll}
            >
              <i className="fa fa-plus" /> Add All Selected
            </button>
          )}
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
