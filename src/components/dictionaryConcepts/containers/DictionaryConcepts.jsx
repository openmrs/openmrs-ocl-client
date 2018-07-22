import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';
import '../style/index.css';

import Header from '../components/Header';
import ConceptDropdown from '../components/ConceptDropdown';
import SideNav from '../components/Sidenav';
import SearchBar from '../components/SearchBar';
import ConceptTable from '../components/ConceptTable';
import { conceptsProps } from '../proptypes';
import { getUsername } from '../components/helperFunction';

import {
  fetchDictionaryConcepts,
  filterBySource,
  filterByClass,
  paginateConcepts,
} from '../../../redux/actions/concepts/dictionaryConcepts';

export class DictionaryConcepts extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        typeName: PropTypes.string,
        collectionName: PropTypes.string,
        type: PropTypes.string,
      }),
    }).isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }).isRequired,
    fetchDictionaryConcepts: PropTypes.func.isRequired,
    concepts: PropTypes.arrayOf(PropTypes.shape(conceptsProps)).isRequired,
    filteredSources: PropTypes.arrayOf(PropTypes.string).isRequired,
    filteredClass: PropTypes.arrayOf(PropTypes.string).isRequired,
    loading: PropTypes.bool.isRequired,
    filterBySource: PropTypes.func.isRequired,
    filterByClass: PropTypes.func.isRequired,
    paginateConcepts: PropTypes.func.isRequired,
    totalConceptCount: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      conceptsCount: this.props.totalConceptCount,
      searchInput: '',
      conceptLimit: 10,
      conceptOffset: 0,
    };
    autoBind(this);
  }

  componentDidMount() {
    this.fetchConcepts();
  }

  componentWillReceiveProps(nextProps) {
    const {
      match: {
        params: { collectionName, type, typeName },
      },
    } = nextProps;
    localStorage.setItem('dictionaryId', this.props.match.params.collectionName);
    localStorage.setItem('type', this.props.match.params.type);
    localStorage.setItem('typeName', this.props.match.params.typeName);
    this.setState({
      collectionName,
      type,
      typeName,
      conceptsCount: nextProps.totalConceptCount,
    });
  }

  fetchConcepts(query = '', limit = 0, filterParams = null, filterName = null) {
    const {
      match: {
        params: { collectionName, type, typeName },
      },
    } = this.props;
    if (filterParams) {
      this.props.filterBySource(filterName, type, typeName, collectionName, query, limit);
    }
    this.props.fetchDictionaryConcepts(type, typeName, collectionName, query, limit);
  }

  handleSearch(event) {
    const {
      target: {
        value, name, checked, type,
      },
    } = event;
    const eventAction = event.target.type === 'checkbox' ? checked : value;
    const inputName = name.split(',')[0];
    const filterType = name.split(',')[1];
    if (type === 'checkbox' && filterType === 'source') {
      this.props.filterBySource(
        inputName,
        this.state.type,
        this.state.typeName,
        this.state.collectionName,
      );
    }
    if (type === 'checkbox' && filterType === 'classes') {
      this.props.filterByClass(
        `"${inputName}"`,
        this.state.type,
        this.state.typeName,
        this.state.collectionName,
      );
    }

    this.setState({
      [inputName]: eventAction,
    });
    if (value.length < 1) {
      this.fetchConcepts();
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    this.fetchConcepts(this.state.searchInput, this.state.conceptsCount);
    this.setState({
      conceptsCount: this.props.concepts.length,
    });
  }

  fetchNextConcepts() {
    this.props.paginateConcepts(null, this.state.conceptLimit + 10, this.state.conceptOffset + 10);
    this.setState(state => ({
      conceptOffset: state.conceptOffset + 10,
      conceptLimit: state.conceptLimit + 10,
    }));
  }
  fetchPrevConcepts() {
    this.props.paginateConcepts(null, this.state.conceptLimit - 10, this.state.conceptOffset - 10);
    this.setState(state => ({
      conceptOffset: state.conceptOffset - 10,
      conceptLimit: state.conceptLimit - 10,
    }));
  }

  render() {
    const {
      match: {
        params: { typeName },
      },
      location: { pathname },
      concepts,
      filteredClass,
      filteredSources,
      loading,
    } = this.props;
    const username = typeName === getUsername();
    const {
      conceptsCount, searchInput, conceptOffset, conceptLimit,
    } = this.state;
    return (
      <div className="container-fluid custom-dictionary-concepts">
        <Header locationPath={this.props.match.params} />
        <section className="row mt-2">
          <div className="col-12 col-md-2 pt-1">
            <h4>Concepts</h4>
          </div>
          {username && <ConceptDropdown pathName={pathname} />}
        </section>

        <section className="row mt-3">
          <SideNav
            typeName={typeName}
            filteredClass={filteredClass}
            filteredSources={filteredSources}
            handleChange={this.handleSearch}
          />
          <div className="col-12 col-md-10">
            <SearchBar
              conceptsCount={conceptLimit}
              totalConceptsCount={conceptsCount}
              handleSearch={this.handleSearch}
              searchValue={searchInput}
              submit={this.handleSubmit}
              countStart={conceptOffset + 1}
              next={this.fetchNextConcepts}
              prev={this.fetchPrevConcepts}
            />
            <ConceptTable concepts={concepts} loading={loading} />
          </div>
        </section>
      </div>
    );
  }
}

export const mapStateToProps = state => ({
  concepts: state.concepts.paginatedConcepts,
  totalConceptCount: state.concepts.totalConceptCount,
  filteredClass: state.concepts.filteredClass,
  filteredSources: state.concepts.filteredSources,
  loading: state.concepts.loading,
  filteredList: state.concepts.filteredList,
  dictionaries: state.dictionaries.dictionary,
});

export default connect(
  mapStateToProps,
  {
    fetchDictionaryConcepts,
    filterBySource,
    filterByClass,
    paginateConcepts,
  },
)(DictionaryConcepts);
