import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { notify } from 'react-notify-toast';
import SideNav from '../component/Sidenav';
import SearchBar from '../component/SearchBar';
import ConceptTable from '../component/ConceptTable';
import Header from './Header';
import {
  addToFilterList,
  previewConcept,
  addConcept,
  fetchFilteredConcepts,
  setCurrentPage,
  clearAllBulkFilters,
  setSortDirectionAction,
  setSortCriteriaAction,
} from '../../../redux/actions/concepts/addBulkConcepts';
import { conceptsProps } from '../../dictionaryConcepts/proptypes';
import { MIN_CHARACTERS_WARNING, MILLISECONDS_TO_SHOW_WARNING } from '../../../redux/reducers/generalSearchReducer';
import { INTERNAL_MAPPING_DEFAULT_SOURCE } from '../../dictionaryConcepts/components/helperFunction';
import SortBar from '../component/SortBar';

export class BulkConceptsPage extends Component {
  static propTypes = {
    setCurrentPage: PropTypes.func.isRequired,
    currentPage: PropTypes.number.isRequired,
    fetchFilteredConcepts: PropTypes.func.isRequired,
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
    datatypeList: PropTypes.array,
    classList: PropTypes.array,
    clearAllBulkFilters: PropTypes.func,
    sortCriteria: PropTypes.string,
    sortDirection: PropTypes.string,
    setSortCriteria: PropTypes.func,
    setSortDirection: PropTypes.func,
  };

  static defaultProps = {
    preview: {},
    datatypeList: [],
    classList: [],
    clearAllBulkFilters: () => {},
    sortCriteria: 'name',
    sortDirection: 'sortAsc',
    setSortCriteria: () => {},
    setSortDirection: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      datatypeInput: '',
      classInput: '',
      searchInput: '',
      conceptLimit: 20,
      searchingOn: false,
      modalId: '',
    };
  }

  componentDidMount() {
    this.getBulkConcepts();
  }


  openModal = (id) => {
    this.setState({ modalId: id });
  };

  closeModal = () => {
    this.setState({ modalId: '' });
  };

  componentDidUpdate(prevProps) {
    const { searchingOn } = this.state;
    const { currentPage, sortCriteria, sortDirection } = this.props;
    // eslint-disable-next-line max-len
    if (currentPage !== prevProps.currentPage || sortCriteria !== prevProps.sortCriteria || sortDirection !== prevProps.sortDirection) {
      if (searchingOn) {
        return this.searchOption();
      }
      return this.getBulkConcepts();
    }
    return null;
  }

  returnToFirstPageAndSearch = () => {
    const { searchingOn } = this.state;
    const { currentPage, setCurrentPage: setPage } = this.props;

    if (currentPage === 1) {
      if (searchingOn) return this.searchOption();
      return this.getBulkConcepts();
    }
    // search is triggered in componentDidUpdate
    return setPage(1);
  };

  handleFilter = (event) => {
    const {
      target: { name },
    } = event;
    const targetName = name.split(',');
    this.setState({ searchingOn: true });
    if ((targetName[1]).trim() === 'datatype') {
      this.props.addToFilterList(targetName[0], 'datatype');
    } else {
      this.props.addToFilterList(targetName[0], 'classes');
    }

    this.returnToFirstPageAndSearch();
  };

  clearBulkFilters = (filterType) => {
    const { clearAllBulkFilters: clearFilters } = this.props;
    clearFilters(filterType);

    this.returnToFirstPageAndSearch();
  };

  getBulkConcepts = () => {
    const { currentPage, fetchFilteredConcepts: bulkConceptsFetched } = this.props;
    const { conceptLimit } = this.state;
    bulkConceptsFetched(undefined, undefined, currentPage, conceptLimit);
  }

  handleChange = (event) => {
    const {
      target: { value },
    } = event;
    if (!value) {
      this.getBulkConcepts();
    }
    this.setState(() => ({ searchInput: value }));
  };

  searchOption = () => {
    const { searchInput } = this.state;
    if ((searchInput && searchInput.trim().length > 2) || (searchInput.trim().length === 0)) {
      const query = `q=${searchInput.trim()}*`; // The asterisk permits partial search
      const { currentPage, fetchFilteredConcepts: fetchedFilteredConcepts } = this.props;
      const { conceptLimit } = this.state;
      fetchedFilteredConcepts(INTERNAL_MAPPING_DEFAULT_SOURCE, query, currentPage, conceptLimit);
    } else notify.show(MIN_CHARACTERS_WARNING, 'error', MILLISECONDS_TO_SHOW_WARNING);
  }

  handleSearch = async (event) => {
    const { setCurrentPage: settingCurrentPage } = this.props;
    event.preventDefault();
    await settingCurrentPage(1);
    this.setState({ searchingOn: true }, () => this.searchOption());
  };

  handleNextPage = (e) => {
    e.preventDefault();
    const { id } = e.target;
    const { searchingOn } = this.state;
    const { setCurrentPage: settingCurrentPage } = this.props;
    settingCurrentPage(Number(id));
    if (searchingOn) {
      return this.searchOption();
    }
    return this.getBulkConcepts();
  };

  render() {
    const {
      concepts,
      loading,
      datatypes,
      preview,
      classes,
      currentPage,
      match: { params },
      previewConcept: previewedConcept,
      addConcept: addedConcept,
      datatypeList,
      classList,
      sortCriteria,
      sortDirection,
      setSortCriteria,
      setSortDirection,
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
            datatypeList={datatypeList}
            classList={classList}
            clearAllBulkFilters={this.clearBulkFilters}
          />
          <div className="col-10 col-md-9 bulk-concept-wrapper custom-full-width">
            <div className="row search-container">
              <SearchBar
                handleSearch={this.handleSearch}
                handleChange={this.handleChange}
                searchInput={searchInput}
              />
              <SortBar
                sortCriteria={sortCriteria}
                setSortCriteria={setSortCriteria}
                sortDirection={sortDirection}
                setSortDirection={setSortDirection}
              />
            </div>
            <ConceptTable
              concepts={concepts}
              loading={loading}
              location={params}
              modalId={this.state.modalId}
              openModal={this.openModal}
              closeModal={this.closeModal}
              preview={preview}
              previewConcept={previewedConcept}
              addConcept={addedConcept}
              handleNextPage={this.handleNextPage}
              conceptLimit={conceptLimit}
              currentPage={currentPage}
            />
          </div>
        </section>
      </div>
    );
  }
}

export const mapStateToProps = ({ bulkConcepts, concepts }) => ({
  loading: concepts.loading,
  concepts: bulkConcepts.bulkConcepts,
  ...bulkConcepts,
  datatypeList: bulkConcepts.datatypeList,
  classList: bulkConcepts.classList,
  sortCriteria: bulkConcepts.sortCriteria,
  sortDirection: bulkConcepts.sortDirection,
});

export default connect(
  mapStateToProps,
  {
    addToFilterList,
    previewConcept,
    addConcept,
    fetchFilteredConcepts,
    setCurrentPage,
    clearAllBulkFilters,
    setSortCriteria: setSortCriteriaAction,
    setSortDirection: setSortDirectionAction,
  },
)(BulkConceptsPage);
