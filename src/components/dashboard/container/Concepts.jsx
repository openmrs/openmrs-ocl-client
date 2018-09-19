import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import fetchConceptsAction from '../../../redux/actions/concepts/index';
import '../styles/index.css';

import SearchConcept from '../components/concepts/Search';
import ConceptList from '../components/concepts/ConceptList';

export class ConceptSearch extends Component {
  static propTypes = {
    fetchConceptsAction: PropTypes.func.isRequired,
    concepts: PropTypes.arrayOf(PropTypes.shape({
      owner: PropTypes.string,
    })).isRequired,
    isFetching: PropTypes.bool.isRequired,
  };
  constructor(props) {
    super(props);

    this.state = {
      searchInput: '',
    };
    this.onSearch = this.onSearch.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.props.fetchConceptsAction();
  }

  onSearch(event) {
    const { value, name, checked } = event.target;
    const trueValue = event.target.type === 'checkbox' ? checked : value;
    this.setState({ [name]: trueValue }, () => {
      if (this.state.searchInput === '') {
        this.props.fetchConceptsAction();
      }
    });
  }

  onSubmit(event) {
    event.preventDefault();
    this.props.fetchConceptsAction(this.state.searchInput, 25, 1);
  }

  render() {
    const {
      searchInput,
    } = this.state;
    return (
      <div className="dashboard-wrapper">
        <SearchConcept
          onSearch={this.onSearch}
          onSubmit={this.onSubmit}
          searchValue={searchInput}
        />
        <div className="container-fluid pt-3">
          <div className="row justify-content-center">
            <div className="col-10 offset-sm-1">
              <ConceptList concepts={this.props.concepts} fetching={this.props.isFetching} />
            </div>
          </div>
        </div>

      </div>
    );
  }
}

export const mapStateToProps = state => ({
  concepts: state.concepts.concepts,
  isFetching: state.concepts.loading,
});

export default connect(mapStateToProps, { fetchConceptsAction })(ConceptSearch);
