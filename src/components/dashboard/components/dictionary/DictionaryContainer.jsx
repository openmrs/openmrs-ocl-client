import React, { Component } from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import '../../styles/index.css';
import './styles/dictionary-modal.css';
import DictionaryDetailCard from './DictionaryDetailCard';
import SideBar from '../SideNavigation';
import Loader from '../../../Loader';
import { fetchDictionary } from '../../../../redux/actions/dictionaries/dictionaryActionCreators';

export class DictionaryOverview extends Component {
  static propTypes = {
    match: propTypes.shape({
      params: propTypes.shape({
        typeName: propTypes.string,
      }),
    }).isRequired,
    dictionary: propTypes.arrayOf(propTypes.shape({
      dictionaryName: propTypes.string,
    })).isRequired,
    fetchDictionary: propTypes.func.isRequired,
    loader: propTypes.bool.isRequired,
  };
  componentDidMount() {
    const {
      match: {
        params: {
          ownerType, owner, type, name,
        },
      },
    } = this.props;
    const url = `/${ownerType}/${owner}/${type}/${name}/`;
    this.props.fetchDictionary(url);
  }
  render() {
    const { loader } = this.props;
    return (
      <div className="dashboard-wrapper">
        <SideBar />
        {loader ? (
          <div className="text-center mt-3" id="loader">
            <Loader />
          </div>
      ) :
          <div className="dashboard-wrapper">
            <DictionaryDetailCard
              dictionary={this.props.dictionary}
            />
          </div>
      }
      </div>
    );
  }
}
export const mapStateToProps = state => ({
  dictionary: state.dictionaries.dictionary,
  loader: state.dictionaries.loading,
});
export default connect(mapStateToProps, { fetchDictionary })(DictionaryOverview);
