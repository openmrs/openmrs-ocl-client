import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';
import InfiniteScroll from 'react-infinite-scroll-component';

import { fetchSources } from '../../../redux/actions/sources/index';
import { clearSources } from '../../../redux/actions/sources/sourcesActionCreators';
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
    clearSources: PropTypes.func.isRequired,
    hasMore: PropTypes.bool.isRequired,
  };
  constructor(props) {
    super(props);

    this.state = {
      searchInput: '',
      sourceType: [],
      offset: 2,
    };
    autoBind(this);
  }

  componentDidMount() {
    this.props.fetchSources();
  }

  onSearch(event) {
    const { value, name, checked } = event.target;
    const { sourceType } = this.state;
    const trueValue = event.target.type === 'checkbox' ? checked : value;
    this.setState({ [name]: trueValue });
    if (name === 'searchInput' && value.length <= 0) {
      this.props.clearSources();
      this.props.fetchSources(value, sourceType, 25, 1);
      this.setState({ offset: 2 });
    }
  }

  onSubmit(event) {
    event.preventDefault();
    const {
      dictionary, external, indicatorRegistry, interfaceTerminology,
    } = this.state;
    const sourceType = [];
    if (dictionary) {
      sourceType.push('Dictionary');
    }
    if (external) {
      sourceType.push('External');
    }
    if (indicatorRegistry) {
      sourceType.push('"Indicator Registry"');
    }
    if (interfaceTerminology) {
      sourceType.push('"Interface Terminology"');
    }
    this.props.clearSources();
    this.setState({ sourceType, offset: 2 });
    this.props.fetchSources(this.state.searchInput, sourceType, 25, 1);
  }

  handleSources(
    searchInput = this.state.searchInput,
    sourceType = this.state.sourceType,
    offset = this.state.offset,
  ) {
    this.props.fetchSources(searchInput, sourceType, 25, offset);
    this.setState(prevState => ({
      offset: prevState.offset + 1,
    }));
  }

  renderEndMessage(sources) {
    if (!this.props.isFetching) {
      return (
        <h6 className="pt-5">
          You have seen all the {sources.length} source(s) your search query returned.
        </h6>
      );
    }
    return '';
  }

  render() {
    const { searchInput } = this.state;
    const { hasMore, sources, isFetching } = this.props;
    return (
      <div className="dashboard-wrapper">
        <SideBar />
        <SearchBar onSearch={this.onSearch} onSubmit={this.onSubmit} searchValue={searchInput} />
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="offset-sm-1 col-10">
              <InfiniteScroll
                dataLength={sources.length}
                next={this.handleSources}
                hasMore={hasMore}
                loader={<h6>Loading...</h6>}
                endMessage={this.renderEndMessage(sources)}
              >
                <ListWrapper sources={sources} fetching={isFetching} />
              </InfiniteScroll>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export const mapStateToProps = state => ({
  sources: state.sources.sources,
  isFetching: state.sources.loading,
  hasMore: state.sources.hasMore,
});

export default connect(
  mapStateToProps,
  { fetchSources, clearSources },
)(SourceSearch);
