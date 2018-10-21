import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SideNav from '../component/Sidenav';
import SearchBar from '../component/SearchBar';
import ConceptTable from '../component/ConceptTable';
import Paginations from '../component/Paginations';
import Header from './Header';
import {
  fetchBulkConcepts,
  addToFilterList,
  previewConcept,
  addConcept,
  fetchFilteredConcepts,
} from '../../../redux/actions/concepts/addBulkConcepts';

import { conceptsProps } from '../../dictionaryConcepts/proptypes';

export class BulkConceptsPage extends Component {
  static propTypes = {
    fetchFilteredConcepts: PropTypes.func.isRequired,
    fetchBulkConcepts: PropTypes.func.isRequired,
    concepts: PropTypes.arrayOf(PropTypes.shape(conceptsProps)).isRequired,
    loading: PropTypes.bool.isRequired,
    preview: PropTypes.shape({
      url: PropTypes.string,
      display_name: PropTypes.string,
    }),
    addConcept: PropTypes.func.isRequired,
    datatypes: PropTypes.array.isRequired,
    previewConcept: PropTypes.func.isRequired,
    classes: PropTypes.array.isRequired,
    addToFilterList: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        type: PropTypes.string,
        typeName: PropTypes.string,
        collectionName: PropTypes.string,
      }).isRequired,
    }).isRequired,
  };
  static defaultProps = {
    preview: {},
  }
  constructor(props) {
    super(props);
    this.state = {
      datatypeInput: '',
      classInput: '',
      currentPage: 1,
      searchInput: '',
    };
  }

  componentDidMount() {
    this.props.fetchBulkConcepts();
  }

  handleFilter = (event) => {
    const {
      target: { name },
    } = event;
    const targetName = name.split(',');
    const query = `q=${this.state.searchInput}`;
    if (targetName[1] === 'datatype') {
      this.props.addToFilterList(targetName[0], 'datatype', query);
    } else {
      this.props.addToFilterList(targetName[0], 'classes', query);
    }
  };

  handleClick = (e) => {
    e.preventDefault();
    const { id } = e.target;
    this.setState({ currentPage: Number(id) });
  };
  handleChange = (event) => {
    const {
      target: { value },
    } = event;
    this.setState(() => ({ searchInput: value }));
    if (!value) {
      this.props.fetchFilteredConcepts('CIEL');
    }
  };

  handleSearch = (event) => {
    event.preventDefault();
    if (this.state.searchInput.trim()) {
      const query = `q=${this.state.searchInput}`;
      this.props.fetchFilteredConcepts('CIEL', query);
    }
  };
  render() {
    const {
      concepts,
      loading,
      datatypes,
      preview,
      classes,
      match: { params },
    } = this.props;
    const {
      datatypeInput, classInput, currentPage, searchInput,
    } = this.state;

    const conceptsPerPage = 20;
    const indexOfLastConcept = currentPage * conceptsPerPage;
    const indexOfFirstConcept = indexOfLastConcept - conceptsPerPage;
    const currentConcepts = this.props.concepts.slice(indexOfFirstConcept, indexOfLastConcept);
    const lastPage = Math.ceil(this.props.concepts.length / conceptsPerPage);
    const lastConcept = indexOfFirstConcept + currentConcepts.length;
    const firstConcept = indexOfLastConcept - 19;
    return (
      <div className="container-fluid bulk-concepts">
        <section>
          <Header locationPath={this.props.match.params} />
          <div className="col-12 pt-1">
            <h4>Add CIEL concepts</h4>
          </div>
        </section>
        <section className="row mt-3">
          <SideNav
            datatypes={datatypes}
            classes={classes}
            dataTypeValue={datatypeInput}
            classValue={classInput}
            handleChange={this.handleFilter}
          />
          <div className="col-10 col-md-9 bulk-concept-wrapper">
            <SearchBar
              handleSearch={this.handleSearch}
              handleChange={this.handleChange}
              searchInput={searchInput}
            />
            <Paginations
              concepts={lastConcept}
              firstConceptIndex={firstConcept}
              totalConcepts={concepts.length}
              currentPage={currentPage}
              handleClick={this.handleClick}
              lastPage={lastPage}
            />
            <ConceptTable
              concepts={currentConcepts}
              loading={loading}
              location={params}
              preview={preview}
              previewConcept={this.props.previewConcept}
              addConcept={this.props.addConcept}
            />
          </div>
        </section>
      </div>
    );
  }
}

export const mapStateToProps = state => ({
  concepts: state.bulkConcepts.bulkConcepts,
  loading: state.concepts.loading,
  datatypes: state.bulkConcepts.datatypes,
  classes: state.bulkConcepts.classes,
  preview: state.bulkConcepts.preview,
});

export default connect(
  mapStateToProps,
  {
    fetchBulkConcepts,
    addToFilterList,
    previewConcept,
    addConcept,
    fetchFilteredConcepts,
  },
)(BulkConceptsPage);
