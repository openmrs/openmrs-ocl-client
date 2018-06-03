import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchSources } from '../../../redux/actions/sources/index';
import '../styles/index.css';

import SideBar from '../components/SideNavigation';
import SearchBar from '../components/SearchBar';
import ListWrapper from '../components/ListWrapper';

export class SourceSearch extends Component {
  static propTypes = {
    fetchSources: PropTypes.func.isRequired,
    sources: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
    })).isRequired,
    isFetching: PropTypes.bool.isRequired,
  };
  constructor(props) {
    super(props);

    this.state = {
      searchInput: '',
      sort: 'sortAsc=name',
    };
    this.onSearch = this.onSearch.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.sortData = this.sortData.bind(this);
  }

  componentDidMount() {
    this.props.fetchSources();
  }

  onSearch(event) {
    const { value, name, checked } = event.target;
    const trueValue = event.target.type === 'checkbox' ? checked : value;
    this.setState({ [name]: trueValue });
  }

  onSubmit(event, sortParams = null) {
    event.preventDefault();
    const {
      dict, ext, IR, IT, sort,
    } = this.state;
    const sourceType = [];
    if (dict) {
      sourceType.push('Dictionary');
    }
    if (ext) {
      sourceType.push('External');
    }
    if (IR) {
      sourceType.push('"Indicator Registry"');
    }
    if (IT) {
      sourceType.push('"Interface Terminology"');
    }
    this.props.fetchSources(this.state.searchInput, sourceType, 25, 1, sortParams || sort);
  }

  sortData(event, sort) {
    event.preventDefault();
    this.setState({ sort });
    this.onSubmit(event, sort);
  }

  render() {
    const {
      searchInput, dict, ext, IR, IT,
    } = this.state;
    return (
      <div className="dashboard-wrapper">
        <SideBar />
        <SearchBar
          onSearch={this.onSearch}
          onSubmit={this.onSubmit}
          searchValue={searchInput}
          dict={dict}
          ext={ext}
          IR={IR}
          IT={IT}
          sort={this.sortData}
        />
        <ListWrapper sources={this.props.sources} fetching={this.props.isFetching} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  sources: state.sources.sources,
  isFetching: state.sources.loading,
});

export default connect(mapStateToProps, { fetchSources })(SourceSearch);
