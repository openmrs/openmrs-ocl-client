import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';
import matchSorter from 'match-sorter';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import { connect } from 'react-redux';
import SideNav from '../components/Sidenav';
import Loader from '../../Loader';
import {
  filterBySource,
  filterByClass,
} from '../../../redux/actions/concepts/dictionaryConcepts';
import {
  fetchDictionaryMappings,
} from '../../../redux/actions/dictionaries/dictionaryActionCreators';
import { fetchMemberStatus } from '../../../redux/actions/user/index';

export class DictionaryMappings extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        typeName: PropTypes.string,
        collectionName: PropTypes.string,
        type: PropTypes.string,
        dictionaryName: PropTypes.string,
      }),
    }).isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }).isRequired,
    mappings: PropTypes.arrayOf(PropTypes.shape({
      from_concept_name: PropTypes.string,
      to_concept_name: PropTypes.string,
      map_type: PropTypes.string,
      source: PropTypes.string,
    })).isRequired,
    loading: PropTypes.bool.isRequired,
    fetchDictionaryMappings: PropTypes.func.isRequired,
  };

  state = {
    mappingLimit: 10,
  };

  componentDidMount() {
    const {
      match: {
        params: {
          type,
        },
      },
    } = this.props;
    this.props.fetchDictionaryMappings(type);
  }

  filterCaseInsensitive = (filter, rows) => {
    const id = filter.pivotId || filter.id;
    return matchSorter(rows, filter.value, { keys: [id] });
  };

  render() {
    const {
      mappings,
      loading,
    } = this.props;
    const { mappingLimit } = this.state;
    const path = localStorage.getItem('dictionaryPathName');
    const dictionaryName = localStorage.getItem('dictionaryName');
    const filter = { filterMethod: this.filterCaseInsensitive, filterAll: true };
    return (
      <div className="container-fluid custom-dictionary-mappings custom-max-width">
          <section className="row mt-2">
            <div className="col-12 col-md-4 pt-1">
              <h4>{`${dictionaryName} Mappings`}</h4>
              <div className="submit-button text-left">
                <Link to={path} className="collection-name small-text">
                  <button className="btn btn-sm btn-secondary rounded-edge" type="submit">
                    Go Back
                  </button>
                </Link>
              </div>
            </div>
          </section>
          <section className="row mt-3">
            <div className="col-12 col-md-10 custom-full-width">
              {
              loading
               && (
               <div className="mt-200 text-center">
                 <Loader />
               </div>)
            }

              {mappings.length > 0 ? (
                <ReactTable
                  data={mappings}
                  loading={loading}
                  defaultPageSize={mappings.length <= mappingLimit ? mappings.length : mappingLimit}
                  filterable
                  noDataText="No mappings!"
                  minRows={0}
                  columns={[
                    {
                      Header: 'From Concept Name',
                      accessor: 'from_concept_name',
                      minWidth: 100,
                      ...filter,
                    },
                    {
                      Header: 'To Concept Name',
                      accessor: 'to_concept_name',
                      ...filter,
                    },
                    {
                      Header: 'Map Type',
                      accessor: 'map_type',
                      ...filter,
                    },
                    {
                      Header: 'Dictionary',
                      accessor: 'source',
                      ...filter,
                    },
                  ]}
                  className="-striped -highlight custom-table-width"
                />

              ) : (
                <div className="col-12 col-md-10 custom-full-width">
                  <h3>No mappings found! </h3>
                </div>
              )
              }
            </div>
          </section>
        </div>
    );
  }
}
export const mapStateToProps = state => ({
  mappings: state.organizations.mappings,
  concepts: state.concepts,
  loading: state.concepts.loading,
});

export default connect(
  mapStateToProps,
  {
    fetchDictionaryMappings,
    fetchMemberStatus,
    filterBySource,
    filterByClass,
  },
)(DictionaryMappings);
