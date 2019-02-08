import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paginations from './Pagination';
import { conceptsProps } from '../../dictionaryConcepts/proptypes';

class ConceptPagination extends Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape(conceptsProps)).isRequired,
    limitCount: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
  };

  showPagination = () => {
    const { data, currentPage, limitCount } = this.props;
    if (currentPage === 1) {
      if (data.length !== limitCount) {
        return false;
      }
    }
    return true;
  }

  getLastPage = () => {
    const { data, currentPage } = this.props;
    const lastPage = data.length === 10 ? (currentPage + 1) : currentPage;
    return lastPage;
  }

  showTo = () => {
    const { data, limitCount, currentPage } = this.props;
    const buildPage = (limitCount * (currentPage - 1)) + data.length;
    return buildPage;
  }

  showFrom = () => {
    const { limitCount, currentPage } = this.props;
    const buildPage = (limitCount * currentPage + 1) - limitCount;
    return buildPage;
  }

  render() {
    const {
      data, currentPage,
    } = this.props;
    return (
      <Paginations
        dictionaries={this.showTo()}
        firstDictionaryIndex={this.showFrom()}
        totalDictionaries={data.length}
        currentPage={currentPage}
        lastPage={this.getLastPage()}
        view={this.showPagination()}
      />
    );
  }
}

export default ConceptPagination;
