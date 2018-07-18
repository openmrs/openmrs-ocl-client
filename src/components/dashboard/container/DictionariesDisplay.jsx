import React, { Component } from 'react';
import autoBind from 'react-autobind';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import '../styles/index.css';
import { fetchDictionaries, searchDictionaries } from '../../../redux/actions/dictionaries/dictionaryActionCreators';
import { clearDictionaries } from '../../../redux/actions/dictionaries/dictionaryActions';
import ListDictionaries from '../components/dictionary/ListDictionaries';
import SearchDictionaries from '../components/dictionary/DictionariesSearch';

export class DictionaryDisplay extends Component {
  static propTypes = {
    fetchDictionaries: propTypes.func.isRequired,
    dictionaries: propTypes.arrayOf(propTypes.shape({
      dictionaryName: propTypes.string,
    })).isRequired,
    isFetching: propTypes.bool.isRequired,
    searchDictionaries: propTypes.func.isRequired,
    clearDictionaries: propTypes.func.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      searchInput: '',
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

  render() {
    const { dictionaries, isFetching } = this.props;
    const { searchInput } = this.state;
    return (
      <div className="dashboard-wrapper">
        <div className="dashboard-head">
          <div className="public-dictionaries">
            <p> Public Dictionaries </p>
          </div>
          <div className="search-dictionary">
            <SearchDictionaries
              onSearch={this.onSearch}
              onSubmit={this.onSubmit}
              searchValue={searchInput}
              fetching={isFetching}
            />
          </div>


          <div className="row justify-content-center public-search" id="container">
            <div className="offset-sm-1 col-10">
              <ListDictionaries
                dictionaries={dictionaries}
                fetching={isFetching}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export const mapStateToProps = state => ({
  dictionaries: state.dictionaries.dictionaries,
  isFetching: state.dictionaries.loading,
  dictionary: state.dictionaries.dictionary,
  organizations: state.organizations.organizations,
});
export default connect(mapStateToProps, {
  fetchDictionaries,
  searchDictionaries,
  clearDictionaries,
})(DictionaryDisplay);
