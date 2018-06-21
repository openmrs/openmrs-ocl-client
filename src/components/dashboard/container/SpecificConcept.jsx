import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import fetchConceptsActionTypes from '../../../redux/actions/concepts/specificConceptAction';
import '../styles/index.css';

import SideBar from '../components/SideNavigation';
import SearchConcept from '../components/concepts/Search';
import SpecificConceptList from '../components/concepts/SpecificConceptList';

export class SpecificConcept extends Component {
  static propTypes = {
    fetchConceptsActionTypes: PropTypes.func.isRequired,
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
    const { organization, name } = this.props.match.params;
    this.props.fetchConceptsActionTypes(organization, name);
  }

  onSearch(event) {
    const nameType = this.props.match.params.name;
    const { organization } = this.props.match.params;
    const { value, name, checked } = event.target;
    const trueValue = event.target.type === 'checkbox' ? checked : value;
    this.setState({ [name]: trueValue }, () => {
      if (this.state.searchInput === '') {
        this.props.fetchConceptsActionTypes(organization, nameType);
      }
    });
  }

  onSubmit(event) {
    event.preventDefault();
    const { organization, name } = this.props.match.params;
    this.props.fetchConceptsActionTypes(organization, name, this.state.searchInput, 25, 1);
  }

  render() {
    const {
      searchInput,
    } = this.state;

    const { organization, name } = this.props.match.params;
    return (
      <div className="dashboard-wrapper">
        <SideBar />
        <SearchConcept
          onSearch={this.onSearch}
          onSubmit={this.onSubmit}
          searchValue={searchInput}
        />
        <div className="title-wrapper" > <strong>Concepts for {name} source in {organization}</strong> </div>
        <div className="container-fluid pt-3">
          <div className="row justify-content-center">
            <div className="col-10 offset-sm-1">
              <SpecificConceptList
                concepts={this.props.concepts}
                fetching={this.props.isFetching}
              />
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
});

export default connect(mapStateToProps, { fetchConceptsActionTypes })(SpecificConcept);
