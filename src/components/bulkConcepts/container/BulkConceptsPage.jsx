import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import '../../dictionaryConcepts/style/index.css';
import '../styles/index.css';
import SideNav from '../component/Sidenav';
import SearchBar from '../component/SearchBar';
import ConceptTable from '../component/ConceptTable';
import Paginations from '../component/Paginations';
import { fetchBulkConcepts } from '../../../redux/actions/concepts/addBulkConcepts';

import { conceptsProps } from '../../dictionaryConcepts/proptypes';

export class BulkConceptsPage extends Component {
  static propTypes = {
    fetchBulkConcepts: PropTypes.func.isRequired,
    concepts: PropTypes.arrayOf(PropTypes.shape(conceptsProps)).isRequired,
    loading: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.fetchBulkConcepts();
  }

  render() {
    const { concepts, loading } = this.props;
    return (
      <div className="container custom-dictionary-concepts bulk-concepts mt-3">
        <section className="row">
          <div className="col-12 pt-1">
            <h4>Add CIEL concepts</h4>
          </div>
        </section>
        <section className="row mt-3">
          <SideNav />
          <div className="col-10 col-md-9 bulk-concept-wrapper">
            <SearchBar />
            <Paginations totalConcepts={concepts.length} />
            <ConceptTable concepts={concepts} loading={loading} />
          </div>
        </section>
      </div>
    );
  }
}

export const mapStateToProps = state => ({
  concepts: state.bulkConcepts.bulkConcepts,
  loading: state.concepts.loading,
});

export default connect(
  mapStateToProps,
  { fetchBulkConcepts },
)(BulkConceptsPage);
