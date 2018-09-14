import React, { Component } from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import '../../styles/index.css';
import './styles/dictionary-modal.css';
import DictionaryDetailCard from './DictionaryDetailCard';
import Loader from '../../../Loader';
import { fetchDictionary, fetchVersions, fetchDictionaryConcepts, releaseHead } from '../../../../redux/actions/dictionaries/dictionaryActionCreators';
import EditDictionary from './EditDictionary';

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
    releaseHead: propTypes.func.isRequired,
    isReleased: propTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      showEditModal: false,
    };
  }
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

    const conceptsUrl = `/${ownerType}/${owner}/collections/${name}/concepts/?q=&limit=0&page=1&verbose=true`;
    this.props.fetchDictionaryConcepts(conceptsUrl);
  }

  componentWillUpdate(prevProps) {
    const {
      match: {
        params: {
          ownerType, owner, type, name,
        },
      },
    } = this.props;
    const versionUrl = `/${ownerType}/${owner}/${type}/${name}/versions/?verbose=true`;

    if (prevProps.isReleased !== this.props.isReleased) {
      this.props.fetchVersions(versionUrl);
    }
  }

  handleRelease = () => {
    const headVersion = this.props.versions.filter(version => version.id === 'HEAD')[0];
    const headVersionObj = Object.assign({}, headVersion);
    const data = {
      released: true,
    };
    const url = headVersionObj.version_url;
    this.props.releaseHead(url, data);
  }
  handleHide = () => this.setState({ showEditModal: false });
  handleShow = () => this.setState({ showEditModal: true });

  render() {
    const { loader } = this.props;
    const cielConcepts = this.props.dictionaryConcepts.filter(concept => concept.owner === 'CIEL').length.toString();
    const customConcepts = this.props.dictionaryConcepts.filter(concept => concept.owner !== 'CIEL').length.toString();
    const diagnosisConcepts = this.props.dictionaryConcepts.filter(concept => concept.concept_class === 'diagnosis').length.toString();
    const procedureConcepts = this.props.dictionaryConcepts.filter(concept => concept.concept_class === 'procedure').length.toString();
    const otherConcepts = this.props.dictionaryConcepts.filter(concept => concept.concept_class !== 'diagnosis' && concept.concept_class !== 'procedure').length.toString();
    const headVersion = this.props.versions.filter(version => version.id === 'HEAD')[0];
    const headVersionIdObj = Object.assign({}, headVersion);

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
              handleRelease={this.handleRelease}
              headVersion={headVersionIdObj}
              showEditModal={this.handleShow}
            />
            <EditDictionary
              show={this.state.showEditModal}
              handleHide={this.handleHide}
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
  dictionaryConcepts: state.concepts.dictionaryConcepts,
  loader: state.dictionaries.loading,
  versions: state.dictionaries.versions,
  isReleased: state.dictionaries.isReleased,
});

export default connect(
  mapStateToProps,
  {
    fetchDictionaryConcepts,
    fetchDictionary,
    fetchVersions,
    releaseHead,
  },
)(DictionaryOverview);
