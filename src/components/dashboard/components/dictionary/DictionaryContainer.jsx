import React, { Component } from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import '../../styles/index.css';
import './styles/dictionary-modal.css';
import DictionaryDetailCard from './DictionaryDetailCard';
import Loader from '../../../Loader';

import { fetchDictionary, fetchVersions, fetchDictionaryConcepts } from '../../../../redux/actions/dictionaries/dictionaryActionCreators';

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
    dictionaryConcepts: propTypes.array.isRequired,
    versions: propTypes.array.isRequired,
    fetchDictionary: propTypes.func.isRequired,
    loader: propTypes.bool.isRequired,
    fetchDictionaryConcepts: propTypes.func.isRequired,
    fetchVersions: propTypes.func.isRequired,
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

    const versionUrl = `/${ownerType}/${owner}/${type}/${name}/versions/?verbose=true`;
    this.props.fetchDictionary(url);
    this.props.fetchVersions(versionUrl);

    const conceptsUrl = `/users/${owner}/collections/${name}/concepts/?q=&limit=0&page=1&verbose=true`;
    this.props.fetchDictionaryConcepts(conceptsUrl);
  }
  render() {
    const { loader } = this.props;
    const cielConcepts = this.props.dictionaryConcepts.filter(concept => concept.owner === 'CIEL').length.toString();
    const customConcepts = this.props.dictionaryConcepts.filter(concept => concept.owner !== 'CIEL').length.toString();
    const diagnosisConcepts = this.props.dictionaryConcepts.filter(concept => concept.concept_class === 'diagnosis').length.toString();
    const procedureConcepts = this.props.dictionaryConcepts.filter(concept => concept.concept_class === 'procedure').length.toString();
    const otherConcepts = this.props.dictionaryConcepts.filter(concept => concept.concept_class !== 'diagnosis' && concept.concept_class !== 'procedure').length.toString();

    return (
      <div className="dashboard-wrapper">
        {loader ? (
          <div className="text-center mt-3" id="loader">
            <Loader />
          </div>
      ) :
          <div className="dashboard-wrapper">
            <DictionaryDetailCard
              dictionary={this.props.dictionary}
              versions={this.props.versions}
              cielConcepts={cielConcepts}
              customConcepts={customConcepts}
              diagnosisConcepts={diagnosisConcepts}
              procedureConcepts={procedureConcepts}
              otherConcepts={otherConcepts}
            />
          </div>
      }
      </div>
    );
  }
}
export const mapStateToProps = state => ({
  dictionary: state.dictionaries.dictionary,
  dictionaryConcepts: state.concepts.dictionaryConcepts,
  loader: state.dictionaries.loading,
  versions: state.dictionaries.versions,
});
export default connect(
  mapStateToProps,
  {
    fetchDictionaryConcepts,
    fetchDictionary,
    fetchVersions,
  },
)(DictionaryOverview);
