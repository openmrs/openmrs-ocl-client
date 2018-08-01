import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './style.css';
import fetchCielConcepts, { addExistingBulkConcepts } from '../../redux/actions/bulkConcepts';
import BulkConceptList from '../bulkConcepts/bulkConceptList';

export class AddBulkConcepts extends Component {
  static propTypes = {
    fetchCielConcepts: PropTypes.func.isRequired,
    addExistingBulkConcepts: PropTypes.func.isRequired,
    cielConcepts: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
    })).isRequired,
    isFetching: PropTypes.bool.isRequired,
  };
  handleAddAll=() => {
    const expressions = this.props.cielConcepts.map(concept => concept.url);
    this.props.addExistingBulkConcepts({ data: { expressions } });
  }
  handleCielClick=() => {
    this.props.fetchCielConcepts();
  }
  render() {
    const dictionaryName = localStorage.getItem('dictionaryName');
    const { cielConcepts } = this.props;
    return (
      <div className="container add-bulk-concepts">
        <a href={document.referrer} id="dictionary-link">
          <i className="fas fa-chevron-left" /> Back to {dictionaryName}
        </a>
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
        <div className="prefered-concepts">
          <BulkConceptList
            cielConcepts={cielConcepts}
            fetching={this.props.isFetching}
          />
        </div>
        <br />
        <div className="add-all-btn">
          <a href={document.referrer}>
            <button type="button" className="btn btn-secondary">
              Back
            </button>
          </a>{' '}
          <button type="button" className="btn btn-primary" id="btn-add-all"onClick={this.handleAddAll}>
            <i className="fa fa-plus" /> Add All
          </button>
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
