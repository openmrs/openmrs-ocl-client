import React, { Component } from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import DictionaryDetailCard from './DictionaryDetailCard';
import Loader from '../../../Loader';
import {
  fetchDictionary, fetchVersions, fetchDictionaryConcepts, releaseHead, createVersion,
} from '../../../../redux/actions/dictionaries/dictionaryActionCreators';
import EditDictionary from './EditDictionary';
import GeneralModel from './common/GeneralModal';

export class DictionaryOverview extends Component {
  static propTypes = {
    match: propTypes.shape({
      params: propTypes.shape({
        typeName: propTypes.string,
      }),
    }).isRequired,
    dictionary: propTypes.object.isRequired,
    dictionaryConcepts: propTypes.array.isRequired,
    versions: propTypes.array.isRequired,
    fetchDictionary: propTypes.func.isRequired,
    loader: propTypes.bool.isRequired,
    fetchDictionaryConcepts: propTypes.func.isRequired,
    fetchVersions: propTypes.func.isRequired,
    createVersion: propTypes.func.isRequired,
    error: propTypes.array,
    isReleased: propTypes.bool.isRequired,
  };

  static defaultProps = {
    error: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      showEditModal: false,
      showSubModal: false,
      url: '',
      openVersionModal: false,
      versionId: '',
      versionDescription: '',
      openGeneralModal: false,
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

    const conceptsUrl = `/${ownerType}/${owner}/collections/${name}/concepts/?includeRetired=true&q=&limit=0&page=1&verbose=true&is_latest_version=true`;
    this.props.fetchDictionaryConcepts(conceptsUrl);
  }

  componentDidUpdate = (prevProps) => {
    const {
      match: {
        params: {
          ownerType, owner, type, name,
        },
      },
    } = this.props;
    const versionUrl = `/${ownerType}/${owner}/${type}/${name}/versions/?verbose=true`;

    if (prevProps.versions.length !== this.props.versions.length) {
      this.props.fetchVersions(versionUrl);
    }
  }

  handleHide = () => this.setState({ showEditModal: false });

  handleShow = () => this.setState({ showEditModal: true });

  handleHideSub = () => this.setState({ showSubModal: false });

  handleShowSub = (url) => { this.setState({ showSubModal: true, url }); }

  hideVersionModal = () => this.setState({ openVersionModal: false });

  showVersionModal = () => this.setState({ openVersionModal: true });

  hideGeneralModal = () => this.setState({ openGeneralModal: false });

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  objectToCsv = (data) => {
    const csvRows = [];

    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(','));

    for (const row of data) {
      const values = headers.map((header) => {
        const escaped = (`${row[header]}`).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }
    return csvRows.join('\n');
  }

  downloadConcept = (data) => {
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'dictionaryConcepts.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  download = () => {
    const { dictionaryConcepts } = this.props;

    const data = dictionaryConcepts.map(row => ({
      owner: row.owner,
      source: row.source,
      preferredName: row.display_name,
      description: row.descriptions ? row.descriptions.map(
        description => description.description,
      ).join(' ') : '',
      conceptClass: row.concept_class,
      datatype: row.datatype,
      retired: row.retired,
      externalId: row.external_id,
      mappings: row.mappings,
      url: row.url,
    }));
    const csvData = this.objectToCsv(data);
    this.downloadConcept(csvData);
  }

  confirmRelease = () => {
    const {
      match: {
        params: {
          ownerType, owner, type, name,
        },
      },
    } = this.props;

    const url = `/${ownerType}/${owner}/${type}/${name}/versions/`;
    const data = {
      id: this.state.versionId,
      released: true,
      description: this.state.versionDescription,
    };
    this.props
      .createVersion(url, data)
      .then(() => {
        if (!this.props.error) {
          this.hideGeneralModal();
        }
      });
  }

  handleCreateVersion = (event) => {
    event.preventDefault();
    this.hideVersionModal();
    this.setState({ openGeneralModal: true });
  }

  render() {
    const { loader } = this.props;
    const {
      url, showSubModal, versionId, openGeneralModal,
    } = this.state;
    const cielConcepts = this.props.dictionaryConcepts.filter(
      concept => concept.owner === 'CIEL',
    ).length.toString();
    const customConcepts = this.props.dictionaryConcepts.filter(
      concept => concept.owner !== 'CIEL',
    ).length.toString();
    const diagnosisConcepts = this.props.dictionaryConcepts.filter(
      concept => concept.concept_class === 'diagnosis',
    ).length.toString();
    const procedureConcepts = this.props.dictionaryConcepts.filter(
      concept => concept.concept_class === 'procedure',
    ).length.toString();
    const otherConcepts = this.props.dictionaryConcepts.filter(
      concept => concept.concept_class !== 'diagnosis'
      && concept.concept_class !== 'procedure',
    ).length.toString();
    const headVersion = this.props.versions.filter(version => version.id === 'HEAD')[0];
    const headVersionIdObj = Object.assign({}, headVersion);
    const inputLength = versionId.length;

    return (
      <div className="dashboard-wrapper custom-max-width">
        {loader ? (
          <div className="text-center mt-3" id="loader">
            <Loader />
          </div>
        )
          : (
            <div className="dashboard-wrapper">
              <DictionaryDetailCard
                dictionary={this.props.dictionary}
                versions={this.props.versions}
                cielConcepts={cielConcepts}
                customConcepts={customConcepts}
                diagnosisConcepts={diagnosisConcepts}
                procedureConcepts={procedureConcepts}
                otherConcepts={otherConcepts}
                headVersion={headVersionIdObj}
                showEditModal={this.handleShow}
                hideSubModal={this.handleHideSub}
                showSubModal={this.handleShowSub}
                subModal={showSubModal}
                subUrl={url}
                hideVersionModal={this.hideVersionModal}
                showVersionModal={this.showVersionModal}
                openVersionModal={this.state.openVersionModal}
                handleChange={this.handleChange}
                disableButton={loader}
                handleCreateVersion={this.handleCreateVersion}
                versionId={this.state.versionId}
                versionDescription={this.state.versionDescription}
                inputLength={inputLength}
                download={this.download}
              />
              <EditDictionary
                show={this.state.showEditModal}
                handleHide={this.handleHide}
                dictionary={this.props.dictionary}
              />
              <GeneralModel
                title="Confirm Release?"
                content="If you click 'Confirm', this version will be released"
                show={openGeneralModal}
                confirm_button="Confirm"
                cancel_button="Cancel"
                hide={this.hideGeneralModal}
                select_confirm={this.confirmRelease}
              />
            </div>
          )
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
  error: state.dictionaries.error,
  isReleased: state.dictionaries.isReleased,
});

export default connect(
  mapStateToProps,
  {
    fetchDictionaryConcepts,
    fetchDictionary,
    fetchVersions,
    createVersion,
    releaseHead,
  },
)(DictionaryOverview);
