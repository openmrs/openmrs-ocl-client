import React, { Component } from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import DictionaryDetailCard from './DictionaryDetailCard';
import Loader from '../../../Loader';
import {
  fetchDictionary, fetchVersions, releaseHead, createVersion,
} from '../../../../redux/actions/dictionaries/dictionaryActionCreators';
import EditDictionary from './EditDictionary';
import GeneralModel from './common/GeneralModal';
import { ORGANIZATIONS } from '../../../../constants';
import { getLoggedInUsername } from '../../../../helperFunctions';
import { fetchMemberStatus } from '../../../../redux/actions/user';

export class DictionaryOverview extends Component {
  static propTypes = {
    match: propTypes.shape({
      params: propTypes.shape({
        typeName: propTypes.string,
      }),
    }).isRequired,
    dictionary: propTypes.object.isRequired,
    versions: propTypes.array.isRequired,
    fetchDictionary: propTypes.func.isRequired,
    loader: propTypes.bool.isRequired,
    fetchDictionaryConcepts: propTypes.func.isRequired,
    fetchVersions: propTypes.func.isRequired,
    createVersion: propTypes.func.isRequired,
    error: propTypes.array,
    isReleased: propTypes.bool.isRequired,
    fetchMemberStatus: propTypes.func,
    userIsOrganizationMember: propTypes.bool,
  };

  static defaultProps = {
    error: null,
    fetchMemberStatus: () => {},
    userIsOrganizationMember: false,
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
      fetchMemberStatus: fetchUsersMembershipStatus,
    } = this.props;

    const url = `/${ownerType}/${owner}/${type}/${name}/`;
    const versionUrl = `/${ownerType}/${owner}/${type}/${name}/versions/?verbose=true`;
    this.props.fetchDictionary(url);
    this.props.fetchVersions(versionUrl);

    if (ownerType === ORGANIZATIONS) {
      const checkMembershipUrl = `/orgs/${owner}/members/${getLoggedInUsername()}/`;
      fetchUsersMembershipStatus(checkMembershipUrl);
    }
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

  userCanEditDictionary = () => {
    const {
      match: {
        params: {
          ownerType, owner,
        },
      },
      userIsOrganizationMember,
    } = this.props;
    if (ownerType === ORGANIZATIONS) return userIsOrganizationMember;
    return owner === getLoggedInUsername();
  };

  render() {
    const { loader } = this.props;
    const {
      url, showSubModal, versionId, openGeneralModal,
    } = this.state;
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
                userCanEditDictionary={this.userCanEditDictionary()}
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
  loader: state.dictionaries.loading || state.dictionaries.fetchingDictionary,
  versions: state.dictionaries.versions,
  error: state.dictionaries.error,
  isReleased: state.dictionaries.isReleased,
  userIsOrganizationMember: state.user.userIsMember,
});

export default connect(
  mapStateToProps,
  {
    fetchDictionary,
    fetchVersions,
    createVersion,
    releaseHead,
    fetchMemberStatus,
  },
)(DictionaryOverview);
