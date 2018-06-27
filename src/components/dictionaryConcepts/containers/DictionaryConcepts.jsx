import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import '../style/index.css';

import Header from '../components/Header';
import ConceptDropdown from '../components/ConceptDropdown';
import SideNav from '../components/Sidenav';
import SearchBar from '../components/SearchBar';
import ConceptTable from '../components/ConceptTable';
import { conceptsProps } from '../proptypes';
import { getTotal } from '../components/helperFunction';

import { fetchDictionaryConcepts } from '../../../redux/actions/concepts/dictionaryConcepts';

export class DictionaryConcepts extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        typeName: PropTypes.string,
      }),
    }).isRequired,
    fetchDictionaryConcepts: PropTypes.func.isRequired,
    concepts: PropTypes.arrayOf(PropTypes.shape(conceptsProps)).isRequired,
    filteredSources: PropTypes.arrayOf(PropTypes.shape({
      Classes: PropTypes.string,
    })).isRequired,
    filteredClass: PropTypes.arrayOf(PropTypes.shape({
      Diagnosis: PropTypes.string,
    })).isRequired,
    loading: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      conceptsCount: getTotal(),
    };
  }

  componentDidMount() {
    const {
      match: {
        params: { collectionName, type, typeName },
      },
    } = this.props;
    this.props.fetchDictionaryConcepts(type, typeName, collectionName);
  }

  render() {
    const {
      match: {
        params: { typeName },
      },
      concepts,
      filteredClass,
      filteredSources,
      loading,
    } = this.props;
    return (
      <div className="container-fluid">
        <Header typeName={typeName} />
        <section className="row mt-2">
          <div className="col-12 col-md-2 pt-1">
            <h4>Concepts</h4>
          </div>
          <ConceptDropdown />
        </section>

        <section className="row mt-3">
          <SideNav
            typeName={typeName}
            filteredClass={filteredClass}
            filteredSources={filteredSources}
          />
          <div className="col-12 col-md-10">
            <SearchBar
              conceptsCount={concepts.length}
              totalConceptsCount={this.state.conceptsCount}
            />
            <ConceptTable concepts={concepts} loading={loading} />
          </div>
        </section>
      </div>
    );
  }
}

export const mapStateToProps = state => ({
  concepts: state.concepts.dictionaryConcepts,
  filteredClass: state.concepts.filteredClass,
  filteredSources: state.concepts.filteredSources,
  loading: state.concepts.loading,
});

export default connect(
  mapStateToProps,
  { fetchDictionaryConcepts },
)(DictionaryConcepts);
