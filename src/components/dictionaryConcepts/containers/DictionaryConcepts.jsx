import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';
import matchSorter from 'match-sorter';
import Header from '../components/Header';
import ConceptDropdown from '../components/ConceptDropdown';
import SideNav from '../components/Sidenav';
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
    fetchMemberStatus: PropTypes.func.isRequired,
    userIsMember: PropTypes.bool.isRequired,
    removeDictionaryConcept: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      searchInput: '',
      conceptLimit: 10,
      versionUrl: '',
      data: {
        references: [],
      },
      openDeleteModal: false,
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
    localStorage.setItem('dictionaryId', this.props.match.params.collectionName);
    localStorage.setItem('type', this.props.match.params.type);
    localStorage.setItem('typeName', this.props.match.params.typeName);
    localStorage.setItem('dictionaryName', this.props.match.params.dictionaryName);
    this.setState({
      collectionName,
      type,
      typeName,
    });
  }

  fetchConcepts(query = '', limit = 0, filterParams = null, filterName = null) {
    const {
      match: {
        params: { collectionName, type, typeName },
      },
    } = this.props;
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

  handleShowDelete = (url) => {
    this.setState({ data: { references: [url] }, versionUrl: url, openDeleteModal: true });
  };

  closeDeleteModal = () => {
    this.setState({ openDeleteModal: false });
  }

  filterCaseInsensitive = (filter, rows) => {
    const id = filter.pivotId || filter.id;
    return matchSorter(rows, filter.value, { keys: [id] });
  };

  render() {
    const {
      match: {
        params: { type, typeName },
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
      conceptLimit,
      openDeleteModal,
    } = this.state;
    localStorage.setItem('dictionaryPathName', pathname);
    return (
      <div className="container-fluid custom-dictionary-concepts">
        <Header locationPath={this.props.match.params} />
        <section className="row mt-2">
          <div className="col-12 col-md-2 pt-1">
            <h4>Concepts</h4>
          </div>
          {hasPermission && <ConceptDropdown pathName={pathname} />}
        </section>

        <section className="row mt-3">
          <SideNav
            typeName={typeName}
            filteredClass={filteredClass}
            filteredSources={filteredSources}
            handleChange={this.handleSearch}
          />
          <div className="col-12 col-md-10">
            <ConceptTable
              concepts={concepts}
              loading={loading}
              conceptLimit={conceptLimit}
              org={org}
              locationPath={this.props.match.params}
              showDeleteModal={this.handleShowDelete}
              url={this.state.versionUrl}
              handleDelete={this.handleDelete}
              openDeleteModal={openDeleteModal}
              closeDeleteModal={this.closeDeleteModal}
              filterConcept={this.filterCaseInsensitive}
            />
          </div>
        </section>
      </div>
    );
  }
}

export const mapStateToProps = state => ({
  concepts: state.concepts.dictionaryConcepts,
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
