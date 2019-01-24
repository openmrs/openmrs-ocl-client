import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import DictionaryVersionsTable from './DictionaryVersionsTable';
import ReleaseVersionModal from './common/ReleaseVersionModal';
import SubscriptionModal from './common/SubscriptionModal';

const DictionaryDetailCard = (props) => {
  const {
    dictionary: {
      name,
      created_on,
      updated_on,
      public_access,
      owner,
      owner_type,
      description,
      owner_url,
      short_code,
      default_locale,
      url,
    },
    versions,
    showEditModal,
    customConcepts,
    cielConcepts,
    diagnosisConcepts,
    procedureConcepts,
    otherConcepts,
    hideSubModal,
    showSubModal,
    subModal,
    subUrl,
    showVersionModal,
    hideVersionModal,
    openVersionModal,
    handleCreateVersion,
    handleChange,
    disableButton,
    versionDescription,
    versionId,
    inputLength,
    download,
  } = props;

  const username = localStorage.getItem('username');

  const DATE_OPTIONS = {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };

  const traditionalUrl = `https://qa.openconceptlab.org${url}`;
  const releasedVersions = versions.filter(version => version.released === true);

  return (
    <div className="dictionaryDetails">
      <section className="backLink">
        <Link
          to="/home"
          className="backLinkText"
        >
          <i className="fas fa-arrow-left">
            {' '}
            <span className="span-text">Go Back Home</span>
          </i>
        </Link>
      </section>
      <h1 id="headingDict" align="left">
        {name}
        {' '}
Dictionary
      </h1>
      <hr />
      <div className="row">
        <form className="col-md-6 custom-full-width" id="conceptsCard">
          <fieldset>
            <legend>General Details</legend>
            <p>
              <b>Preferred Source</b>
: CIEL
            </p>
            <p className="paragraph">
              <b>Public Access</b>
:
              {' '}
              {public_access}
            </p>
            {description ? (
              <p id="desc">
                <b>Description</b>
:
                {' '}
                {description}
              </p>
            ) : (
              <p>
                <b>Description</b>
: No Description
              </p>
            )}
            <p className="paragraph">
              <b>Owner:</b>
              {' '}
              {owner}
(
              {owner_type}
)
            </p>
            <p className="paragraph">
              <b>Created On</b>
:
              {' '}
              {new Date(created_on).toLocaleDateString('en-US', DATE_OPTIONS)}
            </p>
            <p className="paragraph">
              <b>Updated On</b>
:
              {' '}
              {new Date(updated_on).toLocaleDateString('en-US', DATE_OPTIONS)}
            </p>
            {owner === username && (
              <button
                type="button"
                className="btn btn-primary m-3"
                id="editB"
                onClick={showEditModal}
              >
                Edit
              </button>
            )}
          </fieldset>
          <fieldset>
            <legend>Concepts (HEAD version)</legend>
            <p className="paragraph">
              <b>Total Concepts</b>
:
              {' '}
              {Number(customConcepts) + Number(cielConcepts)}
            </p>
            <p className="points">
              <b>Custom Concepts</b>
:
              {' '}
              {customConcepts}
            </p>
            <p className="points">
              <b>From CIEL</b>
:
              {' '}
              {cielConcepts}
            </p>
            <p>
              <b>By class</b>
:
            </p>
            <p className="points">
              <b>Diagnosis</b>
:
              {' '}
              {diagnosisConcepts}
            </p>
            <p className="points">
              <b>Procedure</b>
:
              {' '}
              {procedureConcepts}
            </p>
            <p className="points">
              <b>Others</b>
:
              {' '}
              {otherConcepts}
            </p>
            <Link
              className="btn btn-primary m-3"
              id="conceptB"
              to={`/concepts${owner_url}${short_code}/${name}/${default_locale}`}
            >
              Go to concepts
            </Link>
          </fieldset>
        </form>
        <form className="col-6 menu" id="actionsCard">
          <fieldset>
            <legend>Actions</legend>
            <ul>
              <li>
                <a href={traditionalUrl} target="_blank" rel="noopener noreferrer">
                  <i className="fas fa-external-link-alt" />
Browse in traditional OCL
                </a>
              </li>
              { owner === username
                ? (
                  <li>
                    <button
                      type="button"
                      onClick={showVersionModal}
                      className="fas fa-cloud-upload-alt head"
                      id="releaseVersion"
                    >
                      <span id="release-head">
                        &nbsp;Release&nbsp;latest&nbsp;version
                      </span>
                    </button>
                  </li>
                )
                : null}
            </ul>
          </fieldset>
          <fieldset>
            <legend>{releasedVersions.length > 1 ? 'Versions' : 'Version'}</legend>
            <div className="card" id="versionCard">
              <table>
                <tbody>
                  <tr>
                    <th>Version</th>
                    <th>Release Date</th>
                    <th>Actions</th>
                  </tr>
                  {releasedVersions.length >= 1 ? (
                    releasedVersions.map(version => (
                      <DictionaryVersionsTable
                        version={version}
                        key={version.id}
                        showSubModal={showSubModal}
                        download={download}
                      />
                    ))
                  ) : (
                    <tr>
                      <td className="version-msg" colSpan="4">
                        No released Versions
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </fieldset>
        </form>
      </div>

      <ReleaseVersionModal
        show={openVersionModal}
        click={hideVersionModal}
        handleCreateVersion={handleCreateVersion}
        handleChange={handleChange}
        disableButton={disableButton}
        versionId={versionId}
        versionDescription={versionDescription}
        inputLength={inputLength}
      />
      <SubscriptionModal
        show={subModal}
        click={hideSubModal}
        url={subUrl}
      />
    </div>
  );
};

DictionaryDetailCard.propTypes = {
  dictionary: PropTypes.object.isRequired,
  versions: PropTypes.array.isRequired,
  showEditModal: PropTypes.func.isRequired,
  customConcepts: PropTypes.string.isRequired,
  cielConcepts: PropTypes.string.isRequired,
  diagnosisConcepts: PropTypes.string.isRequired,
  procedureConcepts: PropTypes.string.isRequired,
  otherConcepts: PropTypes.string.isRequired,
  hideSubModal: PropTypes.func.isRequired,
  showSubModal: PropTypes.func.isRequired,
  subModal: PropTypes.bool.isRequired,
  subUrl: PropTypes.string.isRequired,
  showVersionModal: PropTypes.func.isRequired,
  hideVersionModal: PropTypes.func.isRequired,
  openVersionModal: PropTypes.bool.isRequired,
  handleCreateVersion: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  inputLength: PropTypes.number.isRequired,
  download: PropTypes.func.isRequired,
  versionDescription: PropTypes.string.isRequired,
  versionId: PropTypes.string.isRequired,
  disableButton: PropTypes.bool.isRequired,
};

export default DictionaryDetailCard;
