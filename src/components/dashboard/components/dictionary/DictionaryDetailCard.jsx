import React from 'react';
import { Link } from 'react-router-dom';
import './styles/dictionary-modal.css';

const DictionaryDetailCard = (dictionary) => {
  const {
    dictionary: {
      name, created_on, updated_on, public_access, owner, owner_type, active_concepts, description,
      owner_url, short_code, default_locale,
    },
  } = dictionary;
  const DATE_OPTIONS = {
    weekday: 'long', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric',
  };

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
          <p className="points">Custom Concepts: 5</p>
          <p className="points">From CIEL: 1229</p>
          <p>By class:</p>
          <p className="points">Diagnoses: 1000</p>
          <p className="points">Procedure: 124</p>
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
        <tr>
          <td>3</td>
          <td>1-Mar-2018</td>
          <td>Yes</td>
          <td><a href="a">Browse in OCL</a> <a href="#">Download</a> <a href="a">Subscription URL</a></td>
        </tr>
        <tr>
          <td>2</td>
          <td>1-Feb-2018</td>
          <td>Yes</td>
          <td><a href="a">Browse in OCL</a> <a href="#">Download</a> <a href="a">Subscription URL</a></td>
        </tr>
        <tr>
          <td>1</td>
          <td>1-Jan-2018</td>
          <td>Yes</td>
          <td><a href="a">Browse in OCL</a> <a href="#">Download</a> <a href="a">Subscription URL</a></td>
        </tr>
      </table>
    </div>
  </div>
  );
};

export default DictionaryDetailCard;
