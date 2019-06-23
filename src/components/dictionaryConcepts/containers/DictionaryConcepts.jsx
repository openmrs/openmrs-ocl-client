import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';
import Header from '../components/Header';
import ConceptDropdown from '../components/ConceptDropdown';
import SideNav from '../components/Sidenav';
import ConceptTable from '../components/ConceptTable';
import SearchBar from '../../bulkConcepts/component/SearchBar';
import { conceptsProps } from '../proptypes';
import { getUsername } from '../components/helperFunction';
import {
  fetchDictionaryConcepts,
  filterBySource,
  filterByClass,
  paginateConcepts,
  fetchExistingConcept,
  clearAllFilters,
} from '../../../redux/actions/concepts/dictionaryConcepts';
import {
  removeDictionaryConcept,
  removeConceptMapping,
  retireConcept,
  addReferenceToCollectionAction, deleteReferenceFromCollectionAction,
} from '../../../redux/actions/dictionaries/dictionaryActionCreators';
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
    filteredByClass: PropTypes.array,
    filteredBySource: PropTypes.array,
    filterByClass: PropTypes.func.isRequired,
    fetchMemberStatus: PropTypes.func.isRequired,
    userIsMember: PropTypes.bool.isRequired,
    removeDictionaryConcept: PropTypes.func.isRequired,
    removeConceptMappingAction: PropTypes.func.isRequired,
    retireCurrentConcept: PropTypes.func.isRequired,
    getOriginalConcept: PropTypes.func.isRequired,
    originalConcept: PropTypes.shape({}).isRequired,
    addReferenceToCollection: PropTypes.func.isRequired,
    deleteReferenceFromCollection: PropTypes.func.isRequired,
    clearAllFilters: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      searchInput: '',
      conceptLimit: 20,
      versionUrl: '',
      data: {
        references: [],
      },
      openDeleteModal: false,
      isOwner: false,
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

  fetchConcepts(limit = 0) {
    const {
      match: {
        params: { collectionName, type, typeName },
      },
    } = this.props;

    const { searchInput } = this.state;
    const query = `${searchInput.trim()}*`;

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

    this.fetchConcepts();

    this.setState({
      [inputName]: eventAction,
    });
  }

  clearAllFilters(filterType) {
    const { clearAllFilters: clearFilters } = this.props;
    clearFilters(filterType);
    this.fetchConcepts();
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
    this.closeDeleteModal();
  }

  handleShowDelete = (url) => {
    this.setState({ data: { references: [url] }, versionUrl: url, openDeleteModal: true });
  };

  closeDeleteModal = () => {
    this.setState({ openDeleteModal: false });
  }

  handleDeleteMapping = () => {
    const { data } = this.state;
    const { removeConceptMappingAction } = this.props;
    removeConceptMappingAction(data);
  }

  handleShowDeleteMapping = (url) => {
    this.setState({
      data: { references: [url] },
    });
  };

  handleConcepts = (concepts) => {
    const newConcepts = [];
    concepts.forEach((concept) => {
      if (concept.source !== 'CIEL') {
        const newConcept = {
          ...concept,
          source: 'Custom',
        };
        newConcepts.push(newConcept);
      }
      if (concept.source === 'CIEL') {
        newConcepts.push(concept);
      }
    });
    return newConcepts;
  }

  handleChange = (event) => {
    const {
      target: { value },
    } = event;
    this.setState(() => ({ searchInput: value }));
    if (value.length === 0) {
      this.fetchConcepts();
    }
  };

  handleSearchByName = (event) => {
    event.preventDefault();
    this.fetchConcepts();
  };

  handleRetireConcept = async (id, retired) => {
    const {
      concepts,
      retireCurrentConcept,
      addReferenceToCollection,
      deleteReferenceFromCollection,
      match: {
        params: { collectionName, type, typeName },
      },
    } = this.props;
    const selectedConcept = concepts.find(concept => concept.id === id);
    const result = await retireCurrentConcept(selectedConcept.url, retired);
    if (result) {
      let response = await deleteReferenceFromCollection(type, typeName, collectionName, [
        selectedConcept.version_url,
      ]);
      if (!response) return false;

      response = await addReferenceToCollection(type, typeName, collectionName, [result.url]);
      if (!response) return false;
    }

    return true;
  };

  render() {
    const {
      match: {
        params: {
          type, typeName, dictionaryName, collectionName,
        },
      },
      location: { pathname },
      concepts,
      filteredClass,
      filteredSources,
      loading,
      userIsMember,
      filteredByClass,
      filteredBySource,
    } = this.props;

    const myConcepts = this.handleConcepts(concepts);
    const hasPermission = typeName === getUsername() || userIsMember;
    const org = {
      name: (type === 'orgs') ? typeName : '',
      userIsMember,
    };
    const {
      conceptLimit,
      openDeleteModal,
      searchInput,
    } = this.state;
    localStorage.setItem('dictionaryPathName', pathname);

    const filters = [...filteredByClass, ...filteredBySource];
    return (
      <div className="container-fluid custom-dictionary-concepts custom-max-width">
        <Header locationPath={this.props.match.params} />
        <section className="row mt-2">
          <div className="col-12 col-md-2 pt-1">
            <h4>Concepts</h4>
          </div>
          {hasPermission && (
          <ConceptDropdown
            pathName={pathname}
            type={type}
            typeName={typeName}
            dictionaryName={dictionaryName}
            collectionName={collectionName}
          />
          )}
        </section>
        <section className="row mt-3">
          <SideNav
            typeName={typeName}
            filteredClass={filteredClass}
            filteredSources={filteredSources}
            handleChange={this.handleSearch}
            toggleCheck={filters}
            clearAllFilters={this.clearAllFilters}
          />
          <div className="col-12 col-md-10 custom-full-width">
            <SearchBar
              handleSearch={this.handleSearchByName}
              handleChange={this.handleChange}
              searchInput={searchInput}
            />
            <ConceptTable
              concepts={myConcepts}
              loading={loading}
              conceptLimit={conceptLimit}
              org={org}
              locationPath={this.props.match.params}
              showDeleteModal={this.handleShowDelete}
              showDeleteMappingModal={this.handleShowDeleteMapping}
              url={this.state.versionUrl}
              handleDelete={this.handleDelete}
              handleDeleteMapping={this.handleDeleteMapping}
              openDeleteModal={openDeleteModal}
              closeDeleteModal={this.closeDeleteModal}
              retireConcept={this.handleRetireConcept}
              isOwner={this.state.isOwner}
            />
          </div>
        </section>
      </div>
    );
  }
}

DictionaryConcepts.defaultProps = {
  filteredByClass: [],
  filteredBySource: [],
  clearAllFilters: () => {},
};

export const mapStateToProps = state => ({
  concepts: state.concepts.dictionaryConcepts,
  totalConceptCount: state.concepts.totalConceptCount,
  filteredClass: state.concepts.filteredClass,
  filteredByClass: state.concepts.filteredByClass,
  filteredBySource: state.concepts.filteredBySource,
  filteredSources: state.concepts.filteredSources,
  loading: state.concepts.loading,
  filteredList: state.concepts.filteredList,
  dictionaries: state.dictionaries.dictionary,
  userIsMember: state.user.userIsMember,
  originalConcept: state.concepts.existingConcept,
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
    addReferenceToCollection: addReferenceToCollectionAction,
    deleteReferenceFromCollection: deleteReferenceFromCollectionAction,
    removeConceptMappingAction: removeConceptMapping,
    retireCurrentConcept: retireConcept,
    getOriginalConcept: fetchExistingConcept,
    clearAllFilters,
  },
)(DictionaryConcepts);
