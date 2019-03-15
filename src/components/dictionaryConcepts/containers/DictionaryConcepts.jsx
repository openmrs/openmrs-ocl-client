import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';
import uuid from 'uuid/v4';
import Header from '../components/Header';
import ConceptDropdown from '../components/ConceptDropdown';
import SideNav from '../components/Sidenav';
import ConceptTable from '../components/ConceptTable';
import SearchBar from '../../bulkConcepts/component/SearchBar';
import { conceptsProps } from '../proptypes';
import { getUsername, CIEL_SOURCE_URL, INTERNAL_MAPPING_DEFAULT_SOURCE } from '../components/helperFunction';
import {
  fetchDictionaryConcepts,
  fetchConceptsByName,
  filterBySource,
  filterByClass,
  paginateConcepts,
  createNewConcept,
  fetchExistingConcept,
} from '../../../redux/actions/concepts/dictionaryConcepts';
import { removeDictionaryConcept, removeConceptMapping, retireConcept } from '../../../redux/actions/dictionaries/dictionaryActionCreators';
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
    searchByName: PropTypes.func.isRequired,
    retireCurrentConcept: PropTypes.func.isRequired,
    recreateConcept: PropTypes.func.isRequired,
    removeConcept: PropTypes.func.isRequired,
    getOriginalConcept: PropTypes.func.isRequired,
    originalConcept: PropTypes.shape({}).isRequired,
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

  fetchConcepts(query = '', limit = 0) {
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
    const { searchInput } = this.state;
    const query = `q=${searchInput.trim()}`;
    const { searchByName } = this.props;
    searchByName(query);
  };

  recreateMappings = mappings => mappings.map((mapping) => {
    const isInternal = (
      mapping.to_source_url.trim().toLowerCase() === CIEL_SOURCE_URL.trim().toLowerCase()
    );
    const freshMapping = {
      isNew: true,
      url: String(uuid()),
      map_type: mapping.map_type,
      to_concept_code: mapping.to_concept_code,
      to_concept_name: mapping.to_concept_name,
      to_concept_url: mapping.to_concept_url,
      source: isInternal ? INTERNAL_MAPPING_DEFAULT_SOURCE : mapping.source,
      to_source_url: isInternal
        ? `${mapping.to_source_url}concepts/${mapping.to_concept_code}/`
        : mapping.to_source_url,
    };
    return freshMapping;
  });

  retireRemoveRecreate = async (createUrl, concept, versionUrl, type, owner, retired) => {
    const {
      retireCurrentConcept, recreateConcept, removeConcept,
    } = this.props;
    const id = String(uuid());
    const retireProcesses = await Promise.all([
      retireCurrentConcept(concept.url, retired),
      removeConcept({ references: [versionUrl] }, type, owner, concept.source),
      recreateConcept(
        {
          ...concept,
          id,
          retired,
          answers: concept.answers || [],
          mappings: concept && concept.mappings && this.recreateMappings(concept.mappings),
        },
        createUrl,
      ),
    ]);
    return retireProcesses;
  };

  handleRetireConcept = (id, retired) => {
    const { concepts, getOriginalConcept } = this.props;
    const selectedConcept = concepts.find(concept => concept.id === id);
    getOriginalConcept(`${selectedConcept.url}?includeMappings=true`)
      .then(() => {
        const { originalConcept } = this.props;
        const [, type, owner] = selectedConcept.owner_url.split('/');
        if (type && owner) {
          const createUrl = selectedConcept.url.replace(`${id}/`, '');
          this.retireRemoveRecreate(
            createUrl,
            originalConcept,
            selectedConcept.version_url,
            type,
            owner,
            retired,
          );
        }
      });
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
    searchByName: fetchConceptsByName,
    filterBySource,
    filterByClass,
    paginateConcepts,
    fetchMemberStatus,
    removeDictionaryConcept,
    removeConceptMappingAction: removeConceptMapping,
    retireCurrentConcept: retireConcept,
    recreateConcept: createNewConcept,
    removeConcept: removeDictionaryConcept,
    getOriginalConcept: fetchExistingConcept,
  },
)(DictionaryConcepts);
