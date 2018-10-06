import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import DictionaryVersionsTable from './DictionaryVersionsTable';
import ReleaseVersionModal from '../dictionary/common/ReleaseVersionModal';

const DictionaryDetailCard = (props) => {
  const {
    dictionary: {
      name,
      created_on,
      updated_on,
      public_access,
      owner,
      owner_type,
      active_concepts,
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
    headVersion,
    handleRelease,
    hideSubModal,
    showSubModal,
    subModal,
    subUrl,
    showVersionModal,
    hideVersionModal,
    openVersionModal,
    handleCreateVersion,
    handleChange,
    versionId,
    versionDescription,
    inputLength,
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
          <i className="fas fa-arrow-left"> <span className="span-text">Go Back Home</span></i>
        </Link>
      </section>
      <h1 id="headingDict" align="left">
        {name} Dictionary
      </h1>
      <hr />
      <div className="row">
        <form className="col-md-6" id="conceptsCard">
          <fieldset>
            <legend>General Details</legend>
            <p>
              <b>Preferred Source</b>: CIEL
            </p>
            <p className="paragraph">
              <b>Public Access</b>: {public_access}
            </p>
            {description ? (
              <p id="desc">
                <b>Description</b>: {description}
              </p>
            ) : (
              <p><b>Description</b>: No Description</p>
            )}
            <p className="paragraph">
              <b>Owner:</b> {owner}({owner_type})
            </p>
            <p className="paragraph">
              <b>Created On</b>: {new Date(created_on).toLocaleDateString('en-US', DATE_OPTIONS)}
            </p>
            <p className="paragraph">
              <b>Updated On</b>: {new Date(updated_on).toLocaleDateString('en-US', DATE_OPTIONS)}
            </p>
            {owner === username && (
              <Link
                className="btn btn-secondary"
                id="editB"
                to="#"
                onClick={showEditModal}
                versionId={versionId}
                versionDescription={versionDescription}
              >
                Edit
              </Link>
            )}
          </fieldset>
          <fieldset>
            <legend>Concepts (HEAD version)</legend>
            <p className="paragraph">
              <b>Total Concepts</b>: {active_concepts}
            </p>
            <p className="points">
              <b>Custom Concepts</b>: {customConcepts}
            </p>
            <p className="points">
              <b>From CIEL</b>: {cielConcepts}
            </p>
            <p>
              <b>By class</b>:
            </p>
            <p className="points">
              <b>Diagnosis</b>: {diagnosisConcepts}
            </p>
            <p className="points">
              <b>Procedure</b>: {procedureConcepts}
            </p>
            <p className="points">
              <b>Others</b>: {otherConcepts}
            </p>
            <Link
              className="btn btn-secondary"
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
              <li><a href={traditionalUrl} target="_blank" rel="noopener noreferrer"><i className="fas fa-external-link-alt" />Browse in traditional OCL</a></li>
              <li><i className="far fa-copy" />Copy concepts from another dictionary</li>
              { owner === username && !headVersion.released ?
                <li><button type="button" onClick={handleRelease} className="fas fa-cloud-upload-alt head"><span id="release-head"> Release HEAD as new version</span></button></li>
            : null}

              { owner === username ?
                <li><button type="button" onClick={showVersionModal} className="fas fa-cloud-upload-alt version"><span id="release-head"> Release a new version</span></button> </li>
            : null}
            </ul>
          </fieldset>
        </form>
      </div>

      <ReleaseVersionModal
        show={openVersionModal}
        click={hideVersionModal}
        handleCreateVersion={handleCreateVersion}
        handleChange={handleChange}
        inputLength={inputLength}
      />

      <h3 align="left">Released Version</h3>

      <div className="card" id="versionCard">
        <table>
          <tr>
            <th>Version</th>
            <th>Date</th>
            <th>Released</th>
            <th>Actions</th>
          </tr>
          {releasedVersions.length >= 1 ? (
            releasedVersions.map(version => (
              <DictionaryVersionsTable
                version={version}
                key={version.id}
                hide={hideSubModal}
                showSubModal={showSubModal}
                show={subModal}
                url={subUrl}
              />
            ))
          ) : (
            <tr>
              <td className="version-msg" colSpan="4">
                No released Versions
              </td>
            </tr>
          )}
        </table>
      </div>
    </div>
  );
};

DictionaryDetailCard.propTypes = {
  dictionary: PropTypes.object.isRequired,
  versions: PropTypes.array.isRequired,
  handleRelease: PropTypes.func.isRequired,
  showEditModal: PropTypes.object.isRequired,
  customConcepts: PropTypes.string.isRequired,
  cielConcepts: PropTypes.string.isRequired,
  diagnosisConcepts: PropTypes.string.isRequired,
  procedureConcepts: PropTypes.string.isRequired,
  otherConcepts: PropTypes.string.isRequired,
  headVersion: PropTypes.number.isRequired,
  hideSubModal: PropTypes.func.isRequired,
  showSubModal: PropTypes.func.isRequired,
  subModal: PropTypes.bool.isRequired,
  subUrl: PropTypes.string.isRequired,
  showVersionModal: PropTypes.func.isRequired,
  hideVersionModal: PropTypes.func.isRequired,
  openVersionModal: PropTypes.func.isRequired,
  handleCreateVersion: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  versionId: PropTypes.string.isRequired,
  versionDescription: PropTypes.string.isRequired,
  inputLength: PropTypes.number.isRequired,
};

export default DictionaryDetailCard;
