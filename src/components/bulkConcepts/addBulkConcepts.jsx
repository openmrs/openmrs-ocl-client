import React, { Component } from 'react';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
import propTypes from 'prop-types';
import fetchCielConcepts, { addExistingBulkConcepts } from '../../redux/actions/bulkConcepts';
import BulkConceptList from '../bulkConcepts/bulkConceptList';
import Paginations from './component/Paginations';
import Header from '../bulkConcepts/container/Header';

export class AddBulkConcepts extends Component {
  static propTypes = {
    fetchCielConcepts: propTypes.func.isRequired,
    addExistingBulkConcepts: propTypes.func.isRequired,
    cielConcepts: propTypes.arrayOf(propTypes.shape({
      id: propTypes.string,
    })).isRequired,
    isFetching: propTypes.bool.isRequired,
    match: propTypes.shape({
      params: propTypes.shape({
        type: propTypes.string,
        typeName: propTypes.string,
        collectionName: propTypes.string,
      }).isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      cielConcepts: [],
    };
  }

  handleAddAll = () => {
    const {
      match: {
        params: {
          type, typeName, collectionName,
        },
      },
    } = this.props;
    const url = `${type}/${typeName}/collections/${collectionName}/references/`;
    const { cielConcepts } = this.state;
    this.props.addExistingBulkConcepts({ url, data: { data: { expressions: cielConcepts } } });
    setTimeout(() => {
      window.history.back();
    }, 2000);
  }

  handleCielClick=() => {
    this.props.fetchCielConcepts();
  }

  handleBack = () => {
    window.history.back();
  }

  handleSelect = (e) => {
    e.preventDefault();
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
  }

  handlePaginationClick = (e) => {
    e.preventDefault();
    const { id } = e.target;
    this.setState({ currentPage: Number(id) });
  };

  render() {
    const dictionaryName = localStorage.getItem('dictionaryName');
    const { currentPage } = this.state;
    const { cielConcepts } = this.props;

    const conceptsPerPage = 20;
    const indexOfLastConcept = currentPage * conceptsPerPage;
    const indexOfFirstConcept = indexOfLastConcept - conceptsPerPage;
    const currentConcepts = cielConcepts.slice(indexOfFirstConcept, indexOfLastConcept);
    const lastPage = Math.ceil(cielConcepts.length / conceptsPerPage);
    const lastConcept = indexOfFirstConcept + currentConcepts.length;
    const firstConcept = indexOfLastConcept - 19;
    return (
      <div className="container-fluid add-bulk-concepts">
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
                (Other preffered sources here)
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
        <div className="prefered-concepts">
          <BulkConceptList
            cielConcepts={currentConcepts}
            fetching={this.props.isFetching}
            handleSelect={this.handleSelect}
          />
        </div>
        <br />
        <div className="add-all-btn">
          <a href={document.referrer}>
            <button type="button" className="btn btn-secondary btn-bulk-cancel" onClick={this.handleBack}>
              Back
            </button>
          </a>{' '}
          {this.state.cielConcepts.length === 0 ?
            <button type="button" className="btn btn-primary" id="btn-add-all" disabled>
              <i className="fa fa-plus" /> Add All Selected
            </button> :
            <button type="button" className="btn btn-primary btn-add-all" id="btn-add-all" onClick={this.handleAddAll}>
              <i className="fa fa-plus" /> Add All Selected
            </button>
        }
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
