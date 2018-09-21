import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';
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
import { removeDictionaryConcept } from '../../../redux/actions/dictionaries/dictionaryActionCreators';
import { fetchMemberStatus } from '../../../redux/actions/user/index';

export class DictionaryConcepts extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        typeName: PropTypes.string,
        collectionName: PropTypes.string,
        type: PropTypes.string,
        dictionaryName: PropTypes.string,
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
    fetchMemberStatus: PropTypes.func.isRequired,
    userIsMember: PropTypes.bool.isRequired,
    removeDictionaryConcept: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      conceptsCount: this.props.totalConceptCount,
      searchInput: '',
      conceptLimit: 10,
      conceptOffset: 0,
      versionUrl: '',
      data: {
        references: [],
      },
    };
    autoBind(this);
  }

  componentDidMount() {
    setTimeout(this.fetchConcepts, 600);
    this.checkMembershipStatus(getUsername());
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      match: {
        params: { collectionName, type, typeName },
      },
    } = nextProps;
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
    const { typeName, collectionName, searchInput } = this.state;
    if (type === 'checkbox' && filterType === 'source') {
      this.props.filterBySource(
        inputName,
        this.state.type,
        typeName,
        collectionName,
        searchInput,
      );
    }
    if (type === 'checkbox' && filterType === 'classes') {
      this.props.filterByClass(
        `"${inputName}"`,
        this.state.type,
        typeName,
        collectionName,
        searchInput,
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

  checkMembershipStatus(username) {
    const {
      match: {
        params: {
          type, typeName,
        },
      },
    } = this.props;
    if (type === 'orgs') {
      const url = `/${type}/${typeName}/members/${username}/`;
      this.props.fetchMemberStatus(url);
    }
  }

  handleDelete = () => {
    const { data, collectionName, type } = this.state;
    this.props
      .removeDictionaryConcept(data, type, this.props.match.params.typeName, collectionName);
  }

  handleShowDelete = (url) => { this.setState({ data: { references: [url] }, versionUrl: url }); };

  render() {
    const {
      match: {
        params: { type, typeName, dictionaryName, collectionName },
      },
      location: { pathname },
      concepts,
      filteredClass,
      filteredSources,
      loading,
      userIsMember,
    } = this.props;
    const hasPermission = typeName === getUsername() || userIsMember;
    const org = {
      name: (type === 'orgs') ? typeName : '',
      userIsMember,
    };
    const {
      conceptsCount, searchInput, conceptOffset, conceptLimit,
    } = this.state;
    localStorage.setItem('dictionaryPathName', pathname);
    return (
      <div className="container-fluid custom-dictionary-concepts">
        <Header locationPath={this.props.match.params} />
        <section className="row mt-2">
          <div className="col-12 col-md-2 pt-1">
            <h4>Concepts</h4>
          </div>
          {hasPermission && <ConceptDropdown
            pathName={pathname}
            typeName={typeName}
            collectionName={collectionName}
            type={type}
            dictionaryName={dictionaryName}
          />}
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
            <ConceptTable
              concepts={concepts}
              loading={loading}
              org={org}
              locationPath={this.props.match.params}
              showDeleteModal={this.handleShowDelete}
              url={this.state.versionUrl}
              handleDelete={this.handleDelete}
            />
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
  userIsMember: state.user.userIsMember,
});

export default connect(
  mapStateToProps,
  {
    fetchDictionaryConcepts,
    filterBySource,
    filterByClass,
    paginateConcepts,
    fetchMemberStatus,
    removeDictionaryConcept,
  },
)(DictionaryConcepts);
