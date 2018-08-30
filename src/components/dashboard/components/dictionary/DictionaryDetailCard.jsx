import React from 'react';
import { Link } from 'react-router-dom';
import './styles/dictionary-modal.css';
import DictionaryVersionsTable from './DictionaryVersionsTable';

const DictionaryDetailCard = (dictionary) => {
  const {
    dictionary: {
      name, created_on, updated_on, public_access, owner, owner_type, active_concepts, description,
      owner_url, short_code, default_locale,
    }, versions,
  } = dictionary;

  const DATE_OPTIONS = {
    weekday: 'long', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric',
  };

  const releasedVersions = versions.filter(version => version.released === true);

  return (<div className="dictionaryDetails">
    <h1 id="headingDict" align="left">{ name } Dictionary</h1>
    <hr />
    <div className="row">
      <form className="col-6" id="conceptsCard">
        <fieldset>
          <legend>General Details</legend>
          <p>Preferred Source: CIEL</p>
          <p className="paragraph">Public Access: { public_access }</p>
          { description ? (<p id="desc">Description: { description }</p>) : (<p>No Description</p>)}
          <p className="paragraph">Owner: { owner }({ owner_type })</p>
          <p className="paragraph">Created On: { (new Date(created_on)).toLocaleDateString('en-US', DATE_OPTIONS) }</p>
          <p className="paragraph">Updated On: { (new Date(updated_on)).toLocaleDateString('en-US', DATE_OPTIONS) }</p>
          <Link
            className="btn btn-secondary"
            id="editB"
            to="#"
          >
            { public_access }
          </Link>
        </fieldset>
        <fieldset>
          <legend>Concepts (HEAD version)</legend>
          <p className="paragraph">Total Concepts: { active_concepts }</p>
          <p className="points">Custom Concepts: {dictionary.customConcepts}</p>
          <p className="points">From CIEL: {dictionary.cielConcepts}</p>
          <p>By class:</p>
          <p className="points">Diagnosis: {dictionary.diagnosisConcepts}</p>
          <p className="points">Procedure: {dictionary.procedureConcepts}</p>
          <p className="points">Others: {dictionary.otherConcepts}</p>
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
            <li><a href="https://qa.openconceptlab.org/" target="_blank" rel="noopener noreferrer"><i className="fas fa-external-link-alt" />Browse in traditional OCL</a></li>
            <li><i className="far fa-copy" />Copy concepts from another dictionary</li>
            <li><i className="fas fa-cloud-upload-alt" />Release HEAD as new version</li>
          </ul>
        </fieldset>
      </form>
    </div>
    <h3 align="left">Released Version</h3>

    <div className="card" id="versionCard">
      <table>
        <tr>
          <th>Version</th>
          <th>Date</th>
          <th>Released</th>
          <th>Actions</th>
        </tr>

        {releasedVersions.length >= 1 ?
          releasedVersions.map(version => (
            <DictionaryVersionsTable version={version} key={version.id} />
    )) : <tr><td className="version-msg" colSpan="4">No released Versions</td></tr> }
      </table>
    </div>
  </div>
  );
};

export default DictionaryDetailCard;
