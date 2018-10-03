import React, { Component } from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import ListSearchResults from './ListSearchResults';
import generalSearch from '../../redux/actions/GeneralSearchActions/generalSearchActionCreators';

export class GeneralSearchContainer extends Component {
  static propTypes = {
    match: propTypes.shape({
      params: propTypes.shape({
        typeName: propTypes.string,
      }),
    }).isRequired,
    dictionaries: propTypes.arrayOf(propTypes.shape({
      dictionaryName: propTypes.string,
    })).isRequired,
    generalSearch: propTypes.func.isRequired,
    loading: propTypes.bool.isRequired,
  }
  componentDidMount() {
    const {
      match: {
        params: {
          query,
        },
      },
    } = this.props;
    this.props.generalSearch(query);
  }
  render() {
    const { dictionaries, loading } = this.props;
    return (
      <div className="dashboard-wrapper">
        <div className="dashboard-head">
          <div className="row justify-content-center">
            <div className="offset-sm-1 col-10">
              <ListSearchResults
                dictionaries={dictionaries}
                fetching={loading}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export const mapStateToProps = state => ({
  dictionaries: state.generalSearch.dictionaries,
  loading: state.generalSearch.loading,
});
export default connect(mapStateToProps, { generalSearch })(GeneralSearchContainer);
