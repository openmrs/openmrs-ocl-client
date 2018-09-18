import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import fetchConceptsAction from '../../../redux/actions/concepts/index';
import '../styles/index.css';

import SearchConcept from '../components/concepts/Search';
import ConceptList from '../components/concepts/ConceptList';
import Paginations from '../../bulkConcepts/component/Paginations';

export class ConceptSearch extends Component {
  static propTypes = {
    fetchConceptsAction: PropTypes.func.isRequired,
    concepts: PropTypes.arrayOf(PropTypes.shape({
      owner: PropTypes.string,
    })).isRequired,
    isFetching: PropTypes.bool.isRequired,
  };
  constructor(props) {
    super(props);

    this.state = {
      searchInput: '',
      currentPage: 1,
      limit: 50,
    };
    this.onSearch = this.onSearch.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.props.fetchConceptsAction();
  }

  onSearch(event) {
    const { value, name, checked } = event.target;
    const trueValue = event.target.type === 'checkbox' ? checked : value;
    this.setState({ [name]: trueValue }, () => {
      if (this.state.searchInput === '') {
        this.props.fetchConceptsAction();
      }
    });
  }
  onSubmit(event) {
    event.preventDefault();
    this.props.fetchConceptsAction(this.state.searchInput, 25, 1);
  }
  handleClick = (e) => {
    e.preventDefault();
    const { id } = e.target;
    this.setState({ currentPage: Number(id) });
  };
  changeLimit = (value) => {
    this.setState({ limit: value });
  };
  render() {
    const { searchInput } = this.state;
    const { currentPage } = this.state;
    const conceptsPerPage = this.state.limit;
    const indexOfLastConcept = currentPage * conceptsPerPage;
    const indexOfFirstConcept = indexOfLastConcept - conceptsPerPage;
    const currentConcepts = this.props.concepts.slice(indexOfFirstConcept, indexOfLastConcept);
    const lastPage = Math.ceil(this.props.concepts.length / conceptsPerPage);
    const lastConcept = indexOfFirstConcept + currentConcepts.length;
    const firstConcept = indexOfLastConcept - (conceptsPerPage - 1);
    return (
      <div className="dashboard-wrapper">
        <SearchConcept
          onSearch={this.onSearch}
          onSubmit={this.onSubmit}
          searchValue={searchInput}
        />
        <div className="container-fluid pt-3">
          <div className="row justify-content-center">
            <div className="col-10 offset-sm-1">
              <Link to="/dashboard/dictionaries" id="dictionary-link">
                <i className="fas fa-chevron-left" /> Back to Dictionaries
              </Link>
              <div className="container">
                <div className="row justify-content-end">
                  <div className="col-6">
                    <Paginations
                      concepts={lastConcept}
                      firstConceptIndex={firstConcept}
                      totalConcepts={this.props.concepts.length}
                      currentPage={currentPage}
                      handleClick={this.handleClick}
                      lastPage={lastPage}
                      onChangeLimit={value => this.changeLimit(value)}
                    />
                  </div>
                </div>
              </div>
              <ConceptList concepts={currentConcepts} fetching={this.props.isFetching} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export const mapStateToProps = state => ({
  concepts: state.concepts.concepts,
  isFetching: state.concepts.loading,
});
export default connect(
  mapStateToProps,
  { fetchConceptsAction },
)(ConceptSearch);
