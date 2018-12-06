import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import matchSorter from 'match-sorter';
import SideNav from '../component/Sidenav';
import SearchBar from '../component/SearchBar';
import ConceptTable from '../component/ConceptTable';
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
      searchInput: '',
      conceptLimit: 10,
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
    const { searchInput } = this.state;
    if (searchInput.trim() !== searchInput) {
      const query = `q=${this.state.searchInput}`;
      this.props.fetchFilteredConcepts('CIEL', query);
    }
  };

  filterCaseInsensitive = (filter, rows) => {
    const id = filter.pivotId || filter.id;
    return matchSorter(rows, filter.value, { keys: [id] });
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
      datatypeInput, classInput, searchInput, conceptLimit,
    } = this.state;
    return (
      <div className="container-fluid bulk-concepts custom-max-width">
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
          <div className="col-10 col-md-9 bulk-concept-wrapper custom-full-width">
            <SearchBar
              handleSearch={this.handleSearch}
              handleChange={this.handleChange}
              searchInput={searchInput}
            />
            <ConceptTable
              concepts={concepts}
              loading={loading}
              location={params}
              preview={preview}
              previewConcept={this.props.previewConcept}
              addConcept={this.props.addConcept}
              filterConcept={this.filterCaseInsensitive}
              conceptLimit={conceptLimit}
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
