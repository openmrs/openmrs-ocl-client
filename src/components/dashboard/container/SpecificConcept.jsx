import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import autoBind from 'react-autobind';
import InfiniteScroll from 'react-infinite-scroll-component';
import fetchConceptsActionTypes from '../../../redux/actions/concepts/specificConceptAction';
import '../styles/index.css';

import { clearConcepts } from '../../../redux/actions/concepts/ConceptActionCreators';
import SearchConcept from '../components/concepts/Search';
import SpecificConceptList from '../components/concepts/SpecificConceptList';

export class SpecificConcept extends Component {
  static propTypes = {
    fetchConceptsActionTypes: PropTypes.func.isRequired,
    concepts: PropTypes.arrayOf(PropTypes.shape({
      owner: PropTypes.string,
    })).isRequired,
    isFetching: PropTypes.bool.isRequired,
    clearConcepts: PropTypes.func.isRequired,
    hasMore: PropTypes.bool.isRequired,
  };
  constructor(props) {
    super(props);

    this.state = {
      searchInput: '',
      offset: 2,
    };
    autoBind(this);
  }

  componentDidMount() {
    const { organization, name, ownerType } = this.props.match.params;
    this.props.fetchConceptsActionTypes(organization, name, ownerType);
  }

  onSearch(event) {
    const nameType = this.props.match.params.name;
    const { organization } = this.props.match.params;
    const { value, name, checked } = event.target;
    const trueValue = event.target.type === 'checkbox' ? checked : value;
    this.setState({ [name]: trueValue }, () => {
      if (this.state.searchInput === '') {
        this.props.clearConcepts();
        this.props.fetchConceptsActionTypes(organization, nameType);
        this.setState({ offset: 2 });
      }
    });
  }

  onSubmit(event) {
    event.preventDefault();
    this.props.clearConcepts();
    this.setState({ offset: 2 });
    const { organization, name } = this.props.match.params;
    this.props.fetchConceptsActionTypes(organization, name, this.state.searchInput, 25, 1);
  }

  handleNextConcepts(
    searchInput = this.state.searchInput,
    offset = this.state.offset,
  ) {
    const { organization, name } = this.props.match.params;
    this.props.fetchConceptsActionTypes(organization, name, searchInput, 25, offset);
    this.setState(prevState => ({
      offset: prevState.offset + 1,
    }));
  }

  renderEndMessage(concepts) {
    if (!this.props.isFetching) {
      return (
        <h6 className="pt-5 load">
              You have seen all the {concepts.length} concept(s) your search query returned.
        </h6>
      );
    }
    return '';
  }

  render() {
    const {
      searchInput,
    } = this.state;
    const { hasMore, concepts } = this.props;
    const { organization, name } = this.props.match.params;
    const typeName = localStorage.getItem('typeName');
    const dictionaryId = localStorage.getItem('dictionaryId');
    const userType = localStorage.getItem('type');
    return (
      <div className="dashboard-wrapper">
        <SearchConcept
          onSearch={this.onSearch}
          onSubmit={this.onSubmit}
          searchValue={searchInput}
        />
        <div className="title-wrapper" > <strong>Concepts for {name} source in {organization}</strong> </div>
        <div className="container-fluid pt-3">
          <div className="row justify-content-center">
            <div className="col-10 offset-sm-1">
              <Link to={`/concepts/${userType}/${typeName}/${dictionaryId}`} id="dictionary-link">
                <i className="fas fa-chevron-left" /> Back to {dictionaryId} Dictionary
              </Link>
              <InfiniteScroll
                dataLength={concepts.length}
                next={this.handleNextConcepts}
                hasMore={hasMore}
                loader={<h6 className="load">Loading...</h6>}
                endMessage={this.renderEndMessage(concepts)}
              >
                <SpecificConceptList
                  concepts={this.props.concepts}
                  fetching={this.props.isFetching}
                />
              </InfiniteScroll>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

SpecificConcept.propTypes = {
  match: PropTypes.shape({ url: PropTypes.string, params: PropTypes.func }).isRequired,
};

export const mapStateToProps = state => ({
  concepts: state.concepts.concepts,
  isFetching: state.concepts.loading,
  hasMore: state.concepts.hasMore,
});

export default connect(mapStateToProps, {
  fetchConceptsActionTypes,
  clearConcepts,
})(SpecificConcept);
