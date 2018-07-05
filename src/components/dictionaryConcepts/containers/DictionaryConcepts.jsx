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
import { getTotal } from '../components/helperFunction';

import {
  fetchDictionaryConcepts,
  filterBySource,
  filterByClass,
} from '../../../redux/actions/concepts/dictionaryConcepts';

export class DictionaryConcepts extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        typeName: PropTypes.string,
      }),
    }).isRequired,
    fetchDictionaryConcepts: PropTypes.func.isRequired,
    concepts: PropTypes.arrayOf(PropTypes.shape(conceptsProps)).isRequired,
    filteredSources: PropTypes.arrayOf(PropTypes.string).isRequired,
    filteredClass: PropTypes.arrayOf(PropTypes.string).isRequired,
    loading: PropTypes.bool.isRequired,
    filterBySource: PropTypes.func.isRequired,
    filterByClass: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      conceptsCount: getTotal(),
      searchInput: '',
    };
    autoBind(this);
  }

  componentDidMount() {
    this.fetchConcepts();
    const {
      match: {
        params: { collectionName, type, typeName },
      },
    } = this.props;

    this.setState({ collectionName, type, typeName });
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.searchInput) {
      this.setState({
        conceptsCount: nextProps.concepts.length,
      });
    } else {
      this.setState({
        conceptsCount: getTotal(),
      });
    }
  }

  fetchConcepts(query = '', limit = 10, filterParams = null, filterName = null) {
    const {
      match: {
        params: { collectionName, type, typeName },
      },
    } = this.props;
    if (filterParams) {
      this.props.filterBySource(
        filterName,
        type,
        typeName,
        collectionName,
        query,
        filterParams,
        limit,
      );
    }
    this.props.fetchDictionaryConcepts(type, typeName, collectionName, query, filterParams, limit);
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
        filterType,
      );
    }
    if (type === 'checkbox' && filterType === 'classes') {
      this.props.filterByClass(
        `"${inputName}"`,
        this.state.type,
        this.state.typeName,
        this.state.collectionName,
        filterType,
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

  render() {
    const {
      match: {
        params: { typeName },
      },
      concepts,
      filteredClass,
      filteredSources,
      loading,
    } = this.props;
    const { conceptsCount, searchInput } = this.state;
    return (
      <div className="container-fluid custom-dictionary-concepts">
        <Header typeName={typeName} />
        <section className="row mt-2">
          <div className="col-12 col-md-2 pt-1">
            <h4>Concepts</h4>
          </div>
          <ConceptDropdown />
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
              conceptsCount={concepts.length}
              totalConceptsCount={conceptsCount}
              handleSearch={this.handleSearch}
              searchValue={searchInput}
              submit={this.handleSubmit}
            />
            <ConceptTable concepts={concepts} loading={loading} />
          </div>
        </section>
      </div>
    );
  }
}

export const mapStateToProps = state => ({
  concepts: state.concepts.dictionaryConcepts,
  filteredClass: state.concepts.filteredClass,
  filteredSources: state.concepts.filteredSources,
  loading: state.concepts.loading,
  filteredList: state.concepts.filteredList,
});

export default connect(
  mapStateToProps,
  { fetchDictionaryConcepts, filterBySource, filterByClass },
)(DictionaryConcepts);
