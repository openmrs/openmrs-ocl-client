import React, { Component, Fragment } from 'react';
import autoBind from 'react-autobind';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  fetchDictionaries,
  searchDictionaries,
} from '../../../redux/actions/dictionaries/dictionaryActionCreators';
import { clearDictionaries } from '../../../redux/actions/dictionaries/dictionaryActions';
import ListDictionaries from '../components/dictionary/ListDictionaries';
import SearchDictionaries from '../components/dictionary/DictionariesSearch';
import Paginations from '../components/DictionariesPaginations';
import Title from '../../Title';

export class DictionaryDisplay extends Component {
  static propTypes = {
    fetchDictionaries: propTypes.func.isRequired,
    dictionaries: propTypes.arrayOf(propTypes.shape({
      dictionaryName: propTypes.string,
    })).isRequired,
    isFetching: propTypes.bool.isRequired,
    searchDictionaries: propTypes.func.isRequired,
    clearDictionaries: propTypes.func.isRequired,
    history: propTypes.shape({
      push: propTypes.func,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      searchInput: '',
      currentPage: 1,
      limit: 24,
    };
    autoBind(this);
  }

  componentDidMount() {
    this.props.fetchDictionaries();
  }

  onSubmit(event) {
    event.preventDefault();
    this.props.clearDictionaries();
    this.props.searchDictionaries(this.state.searchInput);
  }

  onSearch(event) {
    const { value, name, checked } = event.target;
    const trueValue = event.target.type === 'checkbox' ? checked : value;
    this.setState({ [name]: trueValue });
    if (name === 'searchInput' && value.length <= 0) {
      this.props.clearDictionaries();
      this.props.fetchDictionaries(value);
    }
  }

  gotoDictionary = (url) => {
    this.props.history.push(url);
  };

  handleNextPage = (e) => {
    e.preventDefault();
    const { id } = e.target;
    this.setState({ currentPage: Number(id) });
  };

  render() {
    const { currentPage, searchInput } = this.state;
    const { dictionaries, isFetching } = this.props;
    const dictionariesPerPage = this.state.limit;
    const indexOfLastDictionary = currentPage * dictionariesPerPage;
    const indexOfFirstConcept = indexOfLastDictionary - dictionariesPerPage;
    const currentDictionaries = this.props.dictionaries.slice(
      indexOfFirstConcept,
      indexOfLastDictionary,
    );
    const lastPage = Math.ceil(this.props.dictionaries.length / dictionariesPerPage);
    const lastDictionary = indexOfFirstConcept + currentDictionaries.length;
    const firstDictionary = indexOfLastDictionary - (dictionariesPerPage - 1);
    return (
      <Fragment>
        <Title title="Dictionaries" />
        <div className="row">
          <div className="col-md-12">
            <br />
            <SearchDictionaries
              onSearch={this.onSearch}
              onSubmit={this.onSubmit}
              searchValue={searchInput}
              fetching={isFetching}
            />
          </div>
        </div>
        <Paginations
          dictionaries={lastDictionary}
          firstDictionaryIndex={firstDictionary}
          totalDictionaries={dictionaries.length}
          currentPage={currentPage}
          handleClick={this.handleNextPage}
          lastPage={lastPage}
        />
        <ListDictionaries
          dictionaries={currentDictionaries}
          fetching={isFetching}
          gotoDictionary={this.gotoDictionary}
        />
      </Fragment>
    );
  }
}

export const mapStateToProps = state => ({
  dictionaries: state.dictionaries.dictionaries,
  isFetching: state.dictionaries.loading,
  dictionary: state.dictionaries.dictionary,
  organizations: state.organizations.organizations,
});
export default connect(
  mapStateToProps,
  {
    fetchDictionaries,
    searchDictionaries,
    clearDictionaries,
  },
)(DictionaryDisplay);
