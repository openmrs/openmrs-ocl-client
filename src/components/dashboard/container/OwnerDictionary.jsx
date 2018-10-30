import React, { Component } from 'react';
import autoBind from 'react-autobind';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  fetchDictionaries,
  searchDictionaries,
} from '../../../redux/actions/dictionaries/dictionaryActionCreators';
import { clearDictionaries } from '../../../redux/actions/dictionaries/dictionaryActions';
import OwnerListDictionaries from '../components/dictionary/OwnerListDictionaries';
import SearchDictionaries from '../components/dictionary/DictionariesSearch';
import UserDashboard from '../components/dictionary/user/UserDashboard';
import AddDictionary from '../components/dictionary/AddDictionary';
import Title from '../../Title';

export class OwnerDictionary extends Component {
  static propTypes = {
    fetchDictionaries: propTypes.func.isRequired,
    dictionaries: propTypes.arrayOf(propTypes.shape({
      dictionaryName: propTypes.string,
    })).isRequired,
    isFetching: propTypes.bool.isRequired,
    searchDictionaries: propTypes.func.isRequired,
    clearDictionaries: propTypes.func.isRequired,
    organizations: propTypes.arrayOf(propTypes.shape({
      type: propTypes.string,
      uuid: propTypes.string,
      id: propTypes.string,
      name: propTypes.string,
      company: propTypes.string,
      website: propTypes.string,
      location: propTypes.string,
      public_access: propTypes.string,
      extras: propTypes.shape({
        'extra-meta-data': propTypes.string,
      }),
      url: propTypes.string,
      members_url: propTypes.string,
      sources_url: propTypes.string,
      collections_url: propTypes.string,
      members: propTypes.number,
      public_collections: propTypes.number,
      public_sources: propTypes.number,
      created_on: propTypes.string,
      created_by: propTypes.string,
      updated_on: propTypes.string,
      updated_by: propTypes.string,
    })).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      searchInput: '',
      show: false,
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

  handleHide = () => this.setState({ show: false });

  handleShow = () => this.setState({ show: true });

  render() {
    const { dictionaries, isFetching, organizations } = this.props;
    const { searchInput } = this.state;
    return (
      <div className="dashboard-wrapper">
        <Title title="Login" />
        <UserDashboard
          dictionaries={dictionaries}
          organizations={organizations}
        />
        <p> Your dictionaries </p>
        <div className="dashboard-head">
          <button type="submit" className="btn add-dictionaries" onClick={this.handleShow}>
            Add Dictionary
          </button>
          <SearchDictionaries
            onSearch={this.onSearch}
            onSubmit={this.onSubmit}
            searchValue={searchInput}
            fetching={isFetching}
          />
          <div className="row justify-content-center">
            <div className="offset-sm-1 col-10">
              <OwnerListDictionaries
                dictionaries={dictionaries}
                fetching={isFetching}
              />
            </div>
          </div>
        </div>
        <AddDictionary show={this.state.show} handleHide={this.handleHide} />
        See
        {' '}
        <a href="/dashboard/dictionaries"> all Public Dictionaries</a>
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
export default connect(
  mapStateToProps,
  {
    fetchDictionaries,
    searchDictionaries,
    clearDictionaries,
  },
)(OwnerDictionary);
