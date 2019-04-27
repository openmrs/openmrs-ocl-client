import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { notify } from 'react-notify-toast';
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
  setCurrentPage,
} from '../../../redux/actions/concepts/addBulkConcepts';
import { conceptsProps } from '../../dictionaryConcepts/proptypes';
import { MIN_CHARACTERS_WARNING, MILLISECONDS_TO_SHOW_WARNING } from '../../../redux/reducers/generalSearchReducer';
import { INTERNAL_MAPPING_DEFAULT_SOURCE } from '../../dictionaryConcepts/components/helperFunction';

export class BulkConceptsPage extends Component {
  static propTypes = {
    setCurrentPage: PropTypes.func.isRequired,
    currentPage: PropTypes.number.isRequired,
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
    singleConcept: PropTypes.array,
    recursiveConcept: PropTypes.array,
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
    singleConcept: [],
    recursiveConcept: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      datatypeInput: '',
      classInput: '',
      searchInput: '',
      conceptLimit: 10,
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
    const { currentPage } = this.props;
    if (currentPage !== prevProps.currentPage) {
      if (searchingOn) {
        return this.searchOption();
      }
      return this.getBulkConcepts();
    }
    return null;
  }

  handleFilter = (event) => {
    const {
      target: { name },
    } = event;
    const targetName = name.split(',');
    const query = `q=${this.state.searchInput}`;
    this.setState({ searchingOn: true });
    const { currentPage } = this.props;
    if ((targetName[1]).trim() === 'datatype') {
      this.props.addToFilterList(targetName[0], 'datatype', query, currentPage);
    } else {
      this.props.addToFilterList(targetName[0], 'classes', query, currentPage);
    }
  };

  getBulkConcepts = () => {
    const { currentPage, fetchBulkConcepts: bulkConceptsFetched } = this.props;
    bulkConceptsFetched(currentPage);
  }

  handleChange = (event) => {
    const {
      target: { value },
    } = event;
    if (!value) {
      const { fetchBulkConcepts: bulkConceptsFetched } = this.props;
      bulkConceptsFetched(1);
    }
    this.setState(() => ({ searchInput: value }));
  };

  searchOption = () => {
    const { searchInput } = this.state;
    if ((searchInput && searchInput.trim().length > 2) || (searchInput.trim().length === 0)) {
      const query = `q=${searchInput.trim()}*`; // The asterisk permits partial search
      const { currentPage, fetchFilteredConcepts: fetchedFilteredConcepts } = this.props;
      fetchedFilteredConcepts(INTERNAL_MAPPING_DEFAULT_SOURCE, query, currentPage);
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
      singleConcept,
      recursiveConcept,
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
              modalId={this.state.modalId}
              openModal={this.openModal}
              closeModal={this.closeModal}
              preview={preview}
              previewConcept={previewedConcept}
              addConcept={addedConcept}
              handleNextPage={this.handleNextPage}
              conceptLimit={conceptLimit}
              currentPage={currentPage}
              singleConcept={singleConcept}
              recursiveConcept={recursiveConcept}
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
});

export default connect(
  mapStateToProps,
  {
    fetchBulkConcepts,
    addToFilterList,
    previewConcept,
    addConcept,
    fetchFilteredConcepts,
    setCurrentPage,

  },
)(BulkConceptsPage);
