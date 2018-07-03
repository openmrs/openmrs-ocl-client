import React, { Component } from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import '../../styles/index.css';
import './styles/dictionary-modal.css'
import DictionaryDetailCard from './DictionaryDetailCard';
import SideBar from '../SideNavigation';
import { clearDictionary } from '../../../../redux/actions/dictionaries/dictionaryActions';

export class DictionaryOverview extends Component {
  static propTypes = {
    dictionary: propTypes.arrayOf(propTypes.shape({
      dictionaryName: propTypes.string,
  })).isRequired
  };
  componentWillUnmount(){
    this.props.clearDictionary();
  }
  render (){
    return(
      <div className="dashboard-wrapper">
        <SideBar />
          <DictionaryDetailCard
          dictionary={this.props.dictionary}
          />
      </div>
    );
  }
}
export const mapStateToProps = state => ({
  dictionary: state.dictionaries.dictionary,
})
export default connect(mapStateToProps, {clearDictionary})(DictionaryOverview);
