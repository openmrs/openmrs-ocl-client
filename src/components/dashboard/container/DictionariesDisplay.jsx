import React, { Component } from 'react';
import autoBind from 'react-autobind';
import propTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import { connect } from 'react-redux';
import '../styles/index.css';
import { fetchDictionaries, searchDictionaries, fetchDictionary } from '../../../redux/actions/dictionaries/dictionaryActionCreators';
import { clearDictionaries } from '../../../redux/actions/dictionaries/dictionaryActions';
import SideBar from '../components/SideNavigation';
import ListDictionaries from '../components/dictionary/ListDictionaries';
import SearchDictionaries from '../components/dictionary/DictionariesSearch';
import UserDashboard from '../components/dictionary/user/UserDashboard';

export class DictionaryDisplay extends Component {
    static propTypes = {
      fetchDictionaries: propTypes.func.isRequired,
      dictionaries: propTypes.arrayOf(propTypes.shape({
        dictionaryName: propTypes.string,
      })).isRequired,
      isFetching: propTypes.bool.isRequired,
      searchDictionaries: propTypes.func.isRequired,
      clearDictionaries: propTypes.func.isRequired,
      fetchDictionary: propTypes.func.isRequired,
      organizations: propTypes.arrayOf.isRequired,
    };
    constructor(props) {
      super(props);
      this.state = {
        searchInput: '',
        dictionaryViewOptions: 'user',
      };
      autoBind(this);
    }

    componentDidMount() {
      this.props.fetchDictionaries();
    }

    onSubmit(event) {
      event.preventDefault();
      const { user } = this.state;
      if (user) {
        this.setState({ dictionaryViewOptions: 'user' });
      } else {
        this.setState({ dictionaryViewOptions: 'organizations' });
      }
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

    UNSAFE_componentWillReceiveProps(nextProps) {
      const size = Object.keys(nextProps.dictionary).length;
      { size > 0 &&
            this.props.history.push('/dictionary-details');
      }
    }

    handleDictionaryFetch = (data) => {
      this.props.fetchDictionary(data.url);
    }
    renderEndMessage() {
      if (!this.props.isFetching) {
        return (
          <h6 className="pt-5">
              You have seen all the {this.props.dictionaries.length} dictionar(y)(ies)
               your search query returned.
          </h6>
        );
      }
      return '';
    }
    render() {
      const { dictionaries, isFetching, organizations } = this.props;
      const { searchInput, dictionaryViewOptions } = this.state;
      return (
        <div className="dashboard-wrapper">
          <SideBar />
          <UserDashboard
            dictionaries={dictionaries}
            organizations={organizations}
            viewState={dictionaryViewOptions}
          />
          <SearchDictionaries
            onSearch={this.onSearch}
            onSubmit={this.onSubmit}
            searchValue={searchInput}
            fetching={isFetching}
          />
          <div className="row justify-content-center">
            <div className="offset-sm-1 col-10">
              <InfiniteScroll
                dataLength={dictionaries.length}
                loader={<h6>Loading...</h6>}
                endMessage={this.renderEndMessage()}
              >
                <ListDictionaries
                  dictionaries={dictionaries}
                  fetching={isFetching}
                  fetchData={this.handleDictionaryFetch}
                  dictionaryViewOptions={dictionaryViewOptions}
                />
              </InfiniteScroll>
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
  fetchDictionary,
})(DictionaryDisplay);
